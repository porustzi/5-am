const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '5am_admin_2024';

function arrayToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function signToken(payload, secret) {
  const encoder = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const data = encoder.encode(headerB64 + '.' + payloadB64);
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, data);
  return headerB64 + '.' + payloadB64 + '.' + arrayToBase64(sig);
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

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return json({ error: 'bad_content_type' }, 400);
  }

  try {
    const text = await request.text();
    let body;
    try { body = JSON.parse(text); } catch { return json({ error: 'invalid_json' }, 400); }

    if (!body.username || !body.password) {
      return json({ error: 'missing_credentials' }, 400);
    }

    const validUser = env.ADMIN_USERNAME || ADMIN_USERNAME;
    const validPass = env.ADMIN_PASSWORD || ADMIN_PASSWORD;

    if (body.username === validUser && body.password === validPass) {
      const payload = { sub: body.username, role: 'admin', exp: Math.floor(Date.now() / 1000) + 86400 };
      const token = await signToken(payload, env.JWT_SECRET || '5am-jwt-secret-change-me');
      return json({ access_token: token, token_type: 'bearer', expires_in: 86400 });
    }

    return json({ error: 'invalid_credentials' }, 401);
  } catch (e) {
    return json({ error: 'server_error', detail: e.message }, 500);
  }
}
