// src/components/OptimizedImage.jsx
import React from "react";

/**
 * OptimizedImage
 * - Local assets ("/assets/name.jpg"): uses generated variants
 *   name-480/800/1200/1600 (.jpg + .webp) when present
 * - Remote/blob URLs: renders the original URL as-is (no resize, no variant rewrite)
 * - Display size is always controlled by the caller's className/container —
 *   this component does not invent aspect ratios
 */
export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  sizes,
  style,
  ...rest
}) {
  if (!src) return null;

  const [pathOnly] = src.split("?");
  const isRemote =
    /^https?:\/\//i.test(pathOnly) || pathOnly.startsWith("//");

  const fillStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    ...style,
  };

  // Uploaded / absolute URLs: same fill behavior, original file (no processing)
  if (isRemote) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={className}
        style={fillStyle}
        {...rest}
      />
    );
  }

  const normalized = pathOnly.startsWith("/") ? pathOnly.slice(1) : pathOnly;
  const extIndex = normalized.lastIndexOf(".");
  const base = extIndex !== -1 ? normalized.slice(0, extIndex) : normalized;

  const widths = [480, 800, 1200, 1600];

  const makeSrcSet = (ext) =>
    widths.map((w) => `/${base}-${w}.${ext} ${w}w`).join(", ");

  const defaultSizes =
    sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <picture className="block h-full w-full">
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
        src={`/${base}-800.jpg`}
        alt={alt}
        loading="lazy"
        sizes={defaultSizes}
        className={className}
        style={fillStyle}
        onError={(e) => {
          // fallback to original if optimized missing
          if (e.currentTarget.src !== `/${normalized}`) {
            e.currentTarget.src = `/${normalized}`;
          }
        }}
        {...rest}
      />
    </picture>
  );
}
