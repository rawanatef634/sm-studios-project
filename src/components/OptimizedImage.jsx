/**
 * OptimizedImage
 * - Local /assets paths: prefer generated -480/-800/-1200/-1600 webp+jpg when present
 * - Remote /uploads / Blob URLs: use as-is (uploads are already WebP-optimized)
 * - Display size is controlled by caller className/CSS — no invented aspect ratios
 * - Pass `widths` only when every listed variant exists for the asset
 */
const DEFAULT_WIDTHS = [480, 800, 1200, 1600];

/** Narrower copies saved next to dashboard uploads; must match api/_utils/optimizeImage.js. */
const RESPONSIVE_WIDTHS = [480, 800, 1200, 1600];
const RESPONSIVE_MAX_WIDTH = 2560;
const RESPONSIVE_UPLOAD = /\/(?:images|uploads)\/r\/[\w-]+\.webp$/;

function responsiveUploadSrcSet(pathOnly) {
  if (!RESPONSIVE_UPLOAD.test(pathOnly)) return undefined;
  const base = pathOnly.slice(0, -".webp".length);
  return [
    ...RESPONSIVE_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`),
    `${pathOnly} ${RESPONSIVE_MAX_WIDTH}w`,
  ].join(", ");
}

export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  sizes,
  style,
  fill = false,
  priority = false,
  widths = DEFAULT_WIDTHS,
  ...rest
}) {
  if (!src) return null;

  const [pathOnly] = src.split("?");
  const isRemote =
    /^https?:\/\//i.test(pathOnly) ||
    pathOnly.startsWith("//") ||
    pathOnly.startsWith("/uploads/");

  const fillStyle = fill
    ? { width: "100%", height: "100%", objectFit: "cover", ...style }
    : style;

  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : undefined;

  const defaultSizes = scaleSizes(
    sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    zoomFromStyle(style),
  );

  if (isRemote) {
    const srcSet = responsiveUploadSrcSet(pathOnly);
    return (
      <img
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? defaultSizes : undefined}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={className}
        style={fillStyle}
        {...rest}
      />
    );
  }

  const normalized = pathOnly.startsWith("/") ? pathOnly.slice(1) : pathOnly;
  const extIndex = normalized.lastIndexOf(".");
  const base = extIndex !== -1 ? normalized.slice(0, extIndex) : normalized;
  const original = `/${encodeAssetPath(normalized)}`;

  const makeSrcSet = (ext) =>
    widths
      .map((w) => `/${encodeAssetPath(`${base}-${w}.${ext}`)} ${w}w`)
      .join(", ");

  return (
    <picture className={fill ? "block h-full w-full" : undefined}>
      <source
        type="image/webp"
        srcSet={makeSrcSet("webp")}
        sizes={defaultSizes}
      />
      <source
        type="image/jpeg"
        srcSet={makeSrcSet("jpg")}
        sizes={defaultSizes}
      />
      <img
        src={original}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        sizes={defaultSizes}
        className={className}
        style={fillStyle}
        {...rest}
      />
    </picture>
  );
}

/** Zoom applied by dashboard framing (transform: scale(z)), so srcset picks a sharp enough file. */
function zoomFromStyle(style) {
  const match = /scale\(([\d.]+)\)/.exec(style?.transform || "");
  const zoom = match ? Number(match[1]) : 1;
  return zoom > 1 ? zoom : 1;
}

function scaleSizes(sizes, zoom) {
  if (zoom === 1) return sizes;
  return sizes
    .split(",")
    .map((entry) => {
      const [, media = "", length] = /^\s*(\(.*\)\s+)?(.+?)\s*$/.exec(entry);
      return `${media}calc(${length} * ${zoom})`;
    })
    .join(", ");
}

/** Encode path segments but keep slashes (handles spaces in filenames). */
function encodeAssetPath(path) {
  return path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}
