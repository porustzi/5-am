const REPO = 'porustzi/5-am';
const BRANCH = 'main';

function arrayToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

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
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
    });
  }

  // Auth check
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const payload = await verifyToken(token, env.JWT_SECRET || '5am-jwt-secret-change-me');
  if (!payload) return json({ error: 'unauthorized' }, 401);

  // Build GitHub API URL
  let gitPath = url.pathname.replace(/^\/api\/git\/github\//, '');
  const ref = url.searchParams.get('ref') || BRANCH;
  const githubToken = env.GITHUB_PAT;
  if (!githubToken) return json({ error: 'github_pat_not_set' }, 500);

  const repoApi = `https://api.github.com/repos/${REPO}`;
  let targetUrl, targetMethod = request.method;

  if (request.method === 'GET') {
    targetUrl = `${repoApi}/contents/${gitPath}?ref=${ref}`;
    targetMethod = 'GET';
  } else if (request.method === 'PUT') {
    targetUrl = `${repoApi}/contents/${gitPath}`;
    targetMethod = 'PUT';
  } else {
    return json({ error: 'method_not_supported' }, 405);
  }

  const ghHeaders = {
    'Authorization': `Bearer ${githubToken}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': '5am-cms',
    'Content-Type': 'application/json',
  };

  let ghBody = null;
  if (request.method === 'PUT') {
    try {
      const reqText = await request.text();
      const reqBody = JSON.parse(reqText);
      ghBody = { ...reqBody };
      if (ghBody.content && typeof ghBody.content === 'string') {
        const bytes = new TextEncoder().encode(ghBody.content);
        ghBody.content = arrayToBase64(bytes);
      }
    } catch (e) {
      return json({ error: 'body_parse_error', detail: e.message }, 400);
    }
  }

  try {
    const ghRes = await fetch(targetUrl, {
      method: targetMethod,
      headers: ghHeaders,
      body: ghBody ? JSON.stringify(ghBody) : null,
    });
    const ghData = await ghRes.json();

    if (!ghRes.ok) {
      return json({ error: 'github_error', status: ghRes.status, details: ghData }, ghRes.status);
    }

    // Trigger Cloudflare Pages redeploy on write
    if (targetMethod === 'PUT' && env.CF_API_TOKEN && env.CF_ACCOUNT_ID) {
      context.waitUntil((async () => {
        try {
          await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/pages/projects/5-am/deployments`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${env.CF_API_TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ branch: BRANCH }),
          });
        } catch {}
      })());
    }

    return json(ghData);
  } catch (e) {
    return json({ error: 'proxy_error', detail: e.message }, 502);
  }
}
