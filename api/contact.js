export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  // HA-03 TEST ONLY:
  // Force a controlled 500 response when requested from the frontend.
  if (req.query.forceError === "true") {
    return res.status(500).json({
      ok: false,
      error: "Failed to save contact submission",
    });
  }

  if (!checkRateLimit(getClientIp(req))) {
    return res.status(429).json({
      error: "Too many submissions. Please wait a few minutes and try again.",
    });
  }

  let body;

  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const parsed = validateContact(body);

  if (!parsed.ok) {
    return res.status(400).json({
      error: "Please correct the highlighted fields.",
      errors: parsed.errors,
    });
  }

  const { name, email, phone, project, location, area, requirements } =
    parsed.fields;

  const title = "NEW WEBSITE CONTACT";

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Project type", project],
    ["Location", location],
    ["Area (SQM)", area],
    ["Special requirements", requirements],
  ];

  try {
    await sendStudioEmail({
      subject: `${title} — ${name}`,
      html: rowsToHtml(title, rows),
      text: rowsToText(title, rows),
      replyTo: email,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    if (err instanceof MailConfigError) {
      return res.status(err.status).json({ error: err.message });
    }

    console.error("[contact] send failed:", err.message || err);

    return res.status(err.status || 502).json({
      error: `Could not send your message to ${CONTACT_TO}. Please try again or email that address directly.`,
    });
  }
}