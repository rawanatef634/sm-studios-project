import { cookieAttrs } from "../_utils/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  // Max-Age=0 immediately expires the cookie in the browser.
  res.setHeader(
    "Set-Cookie",
    `sm_session=; ${cookieAttrs(req)}; Max-Age=0`,
  );
  return res.status(200).json({ ok: true });
}
