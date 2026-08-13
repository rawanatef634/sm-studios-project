/**
 * Vercel Blob credentials.
 *
 * Prefer SMS_PUBLIC_READ_WRITE_TOKEN (public store) over BLOB_READ_WRITE_TOKEN
 * (project-default store, which may be private). Explicit `token` wins over
 * Vercel OIDC + BLOB_STORE_ID, so public-access puts hit the public store.
 *
 * Never send these values to the browser.
 */

export function getBlobReadWriteToken() {
  return (
    process.env.SMS_PUBLIC_READ_WRITE_TOKEN ||
    process.env.BLOB_READ_WRITE_TOKEN ||
    ""
  );
}

export function getBlobTokenSource() {
  if (process.env.SMS_PUBLIC_READ_WRITE_TOKEN) {
    return "SMS_PUBLIC_READ_WRITE_TOKEN";
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return "BLOB_READ_WRITE_TOKEN";
  }
  return null;
}

export function hasBlobToken() {
  return Boolean(getBlobReadWriteToken());
}

export function blobAuth() {
  const token = getBlobReadWriteToken();
  return token ? { token } : {};
}
