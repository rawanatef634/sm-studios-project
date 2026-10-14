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

/** Widths of the smaller copies served via srcset; must match RESPONSIVE_WIDTHS in OptimizedImage.jsx. */
export const RESPONSIVE_WIDTHS = [480, 800, 1200, 1600];
const RESPONSIVE_MAX_EDGE = 2560;
const RESPONSIVE_QUALITY = 80;

/**
 * Full-size WebP (max 2560px edge) plus narrower copies for responsive loading.
 * Never upscales: copies wider than the source are encoded at the source width.
 *
 * @param {Buffer} input
 * @returns {Promise<{ main: Buffer, variants: { width: number, buffer: Buffer }[] }>}
 */
export async function optimizeImageVariants(input) {
  const source = sharp(input, { failOn: "none" }).rotate();
  const encode = (resize) =>
    source
      .clone()
      .resize({ ...resize, fit: "inside", withoutEnlargement: true })
      .webp({ quality: RESPONSIVE_QUALITY, effort: 5, smartSubsample: true })
      .toBuffer();

  const [main, ...variantBuffers] = await Promise.all([
    encode({ width: RESPONSIVE_MAX_EDGE, height: RESPONSIVE_MAX_EDGE }),
    ...RESPONSIVE_WIDTHS.map((width) => encode({ width })),
  ]);

  return {
    main,
    variants: RESPONSIVE_WIDTHS.map((width, i) => ({
      width,
      buffer: variantBuffers[i],
    })),
  };
}
