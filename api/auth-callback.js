import { pins } from './auth-start.js';

export default async function handler(req, res) {
  const { code, state: pin } = req.query;
  const session = pins.get(pin);
  if (!session) return res.status(400).send('Invalid PIN');
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.REDIRECT_URI,
    code_verifier: session.verifier,
  });
  const creds = Buffer.from(
    `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
  ).toString('base64');
  const resp = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${creds}`,
    },
    body,
  });
  const { access_token } = await resp.json();
  session.token = access_token;
  res.send('<h2>Done! Go back to your glasses. ✓</h2>');
}