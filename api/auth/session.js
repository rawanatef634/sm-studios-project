import { verifySession } from "../_utils/auth.js";

export default async function handler(req, res) {
  const session = verifySession(req);

  if (!session) {
    return res.status(401).json({ authenticated: false });
  }

  return res.status(200).json({ authenticated: true });
}
