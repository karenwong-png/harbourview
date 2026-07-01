/**
 * POST /api/login
 * Header: x-admin-password
 * Returns: { ok: true } when the password matches, 401 otherwise.
 *
 * Lightweight gate so the admin form only unlocks after a correct password.
 * The real protection still lives on /api/generate and /api/publish, which
 * re-check the password on every call.
 *
 * Requires env: ADMIN_PASSWORD
 */
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const supplied = req.headers['x-admin-password'] || '';
  if (!process.env.ADMIN_PASSWORD)
    return res.status(500).json({ error: 'ADMIN_PASSWORD is not configured' });
  if (supplied !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Wrong password' });

  return res.status(200).json({ ok: true });
};
