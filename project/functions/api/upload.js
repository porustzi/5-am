async function verifyToken(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const encoder = new TextEncoder();
    const data = encoder.encode(parts[0] + '.' + parts[1]);
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    let sigStr = parts[2].replace(/-/g, '+').replace(/_/g, '/');
    while (sigStr.length % 4) sigStr += '=';
    const sigBytes = Uint8Array.from(atob(sigStr), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, data);
    if (!valid) return null;
    let payloadStr = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (payloadStr.length % 4) payloadStr += '=';
    return JSON.parse(atob(payloadStr));
  } catch { return null; }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (request.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const payload = await verifyToken(token, env.JWT_SECRET || '5am-jwt-secret-change-me');
  if (!payload) return json({ error: 'unauthorized' }, 401);

  const githubToken = env.GITHUB_PAT;
  if (!githubToken) return json({ error: 'github_pat_not_set' }, 500);

  let body;
  try { body = await request.json(); }
  catch { return json({ error: 'invalid_json' }, 400); }

  const { filename, content } = body;
  if (!filename || !content) return json({ error: 'missing_filename_or_content' }, 400);

  const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_');
  const ts = Date.now();
  const uploadPath = `project/public/uploads/${ts}-${cleanName}`;

  let imageContent = content;
  if (imageContent.includes(',')) imageContent = imageContent.split(',')[1];

  const encodedPath = uploadPath.split('/').map(function(s) { return encodeURIComponent(s); }).join('/');
  const apiUrl = `https://api.github.com/repos/porustzi/5-am/contents/${encodedPath}`;

  try {
    const ghRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': '5am-cms',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload ${cleanName}`,
        content: imageContent,
        branch: 'main',
      }),
    });

    const ghData = await ghRes.json();
    if (!ghRes.ok) return json({ error: 'github_error', status: ghRes.status, details: ghData }, ghRes.status);

    if (env.CF_API_TOKEN && env.CF_ACCOUNT_ID) {
      context.waitUntil((async () => {
        try {
          await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/pages/projects/5-am/deployments`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${env.CF_API_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ branch: 'main' }),
          });
        } catch {}
      })());
    }

    return json({
      url: ghData.content.download_url,
      path: uploadPath,
    });
  } catch (e) {
    return json({ error: 'proxy_error', detail: e.message }, 502);
  }
}
