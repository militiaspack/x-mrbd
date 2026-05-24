import { pins } from './auth-start.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { pin } = req.query;
  const session = pins.get(pin);
  if (!session || Date.now() > session.expires)
    return res.json({ status: 'expired' });
  if (!session.token)
    return res.json({ status: 'pending' });
  const token = session.token;
  pins.delete(pin);
  res.json({ status: 'ok', token });
}