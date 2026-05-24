import crypto from 'crypto';
const pins = new Map();
export { pins };

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const pin = Math.floor(1000 + Math.random() * 9000).toString();
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  pins.set(pin, { verifier, token: null, expires: Date.now() + 600000 });
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.X_CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    scope: 'tweet.read users.read offline.access',
    state: pin,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });
  res.json({ pin, authUrl: `https://twitter.com/i/oauth2/authorize?${params}` });
}