/**
 * OptimizedImage
 * - Local /assets paths: prefer generated -480/-800/-1200/-1600 webp+jpg when present
 * - Remote /uploads / Blob URLs: use as-is (uploads are already WebP-optimized)
 * - Display size is controlled by caller className/CSS — no invented aspect ratios
 */
export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  sizes,
  style,
  fill = false,
  priority = false,
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

  if (isRemote) {
    return (
      <img
        src={src}
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

  const widths = [480, 800, 1200, 1600];
  const makeSrcSet = (ext) =>
    widths
      .map((w) => `/${encodeAssetPath(`${base}-${w}.${ext}`)} ${w}w`)
      .join(", ");

  const defaultSizes =
    sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

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

/** Encode path segments but keep slashes (handles spaces in filenames). */
function encodeAssetPath(path) {
  return path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}
