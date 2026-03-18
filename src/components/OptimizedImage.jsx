// src/components/OptimizedImage.jsx
import React, { useMemo } from "react";

/**
 * OptimizedImage
 * - Expects original src like "/assets/name.jpg" in public/
 * - Uses generated variants: name-480.jpg, name-800.jpg, name-1200.jpg, name-1600.jpg
 * - Serves WebP when supported
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

  // normalize and get base (without extension)
  const [pathOnly] = src.split("?");
  const normalized = pathOnly.startsWith("/") ? pathOnly.slice(1) : pathOnly;
  const extIndex = normalized.lastIndexOf(".");
  const base = extIndex !== -1 ? normalized.slice(0, extIndex) : normalized;

  const widths = [480, 800, 1200, 1600];

  const makeSrcSet = (ext) =>
    widths.map((w) => `/${base}-${w}.${ext} ${w}w`).join(", ");

  const defaultSizes = sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <picture>
      <source type="image/webp" srcSet={makeSrcSet("webp")} sizes={defaultSizes} />
      <source type="image/jpeg" srcSet={makeSrcSet("jpg")} sizes={defaultSizes} />
      <img
        src={`/${base}-800.jpg`}
        alt={alt}
        loading="lazy"
        sizes={defaultSizes}
        className={className}
        style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
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
