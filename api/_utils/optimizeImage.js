/**
 * Server-side image optimization with sharp.
 * Used on upload so the public site never serves huge originals.
 */
import sharp from "sharp";

/** Max edge length for display images (keeps detail on retina, cuts weight). */
const MAX_EDGE = 1920;
const WEBP_QUALITY = 78;

/**
 * Convert an uploaded image buffer into a compressed WebP suitable for the site.
 * Does not invent crop/aspect — only shrinks if larger than MAX_EDGE.
 *
 * @param {Buffer} input
 * @returns {Promise<{ buffer: Buffer, contentType: "image/webp", ext: ".webp" }>}
 */
export async function optimizeImageBuffer(input) {
  const image = sharp(input, { failOn: "none" }).rotate();
  const meta = await image.metadata();

  const width = meta.width || 0;
  const height = meta.height || 0;
  const needsResize = width > MAX_EDGE || height > MAX_EDGE;

  let pipeline = image;
  if (needsResize) {
    pipeline = pipeline.resize({
      width: width >= height ? MAX_EDGE : undefined,
      height: height > width ? MAX_EDGE : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const buffer = await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer();

  return {
    buffer,
    contentType: "image/webp",
    ext: ".webp",
  };
}
