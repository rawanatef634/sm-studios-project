/**
 * Per-image framing (focal point + zoom) chosen in the dashboard.
 * The same CSS is used by the public site and the dashboard previews,
 * so what the admin sees in a preview is exactly what visitors see.
 */

export const DEFAULT_FRAME = { x: 50, y: 50, zoom: 1 };
export const MAX_ZOOM = 2.5;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** @param {unknown} frame */
export function normalizeFrame(frame) {
  const f = frame && typeof frame === "object" ? frame : {};
  return {
    x: clamp(Number.isFinite(f.x) ? f.x : DEFAULT_FRAME.x, 0, 100),
    y: clamp(Number.isFinite(f.y) ? f.y : DEFAULT_FRAME.y, 0, 100),
    zoom: clamp(Number.isFinite(f.zoom) ? f.zoom : DEFAULT_FRAME.zoom, 1, MAX_ZOOM),
  };
}

export function isDefaultFrame(frame) {
  const f = normalizeFrame(frame);
  return (
    f.x === DEFAULT_FRAME.x &&
    f.y === DEFAULT_FRAME.y &&
    f.zoom === DEFAULT_FRAME.zoom
  );
}

/**
 * Inline style for an object-cover image. The parent must clip overflow
 * (overflow-hidden) for zoom to stay inside the frame.
 */
export function frameStyle(frame) {
  const { x, y, zoom } = normalizeFrame(frame);
  const position = `${x}% ${y}%`;
  return {
    objectPosition: position,
    ...(zoom > 1 ? { transform: `scale(${zoom})`, transformOrigin: position } : {}),
  };
}

/**
 * Pick the first available image among `slots` and return it with its framing.
 * @param {import("../types/project").Project} project
 * @param {ImageSlot[]} slots
 */
export function projectImage(project, slots) {
  for (const slot of slots) {
    const src = slotImage(project, slot);
    if (src) {
      return { src, style: frameStyle(project.imageFraming?.[slot]) };
    }
  }
  return { src: undefined, style: undefined };
}

/** @typedef {"heroImage" | "img" | "mainImage" | "wideImage" | "designImage1" | "designImage2"} ImageSlot */

/** @param {ImageSlot} slot */
export function slotImage(project, slot) {
  if (slot === "designImage1") return project.designImages?.[0];
  if (slot === "designImage2") return project.designImages?.[1];
  return project[slot];
}

/**
 * Where each image appears on the site, with the frame shape (width / height)
 * it is shown in. Ratios mirror the classes in ProjectTemplate, HeroSection,
 * Hero, Projects (page) and the home portfolio carousel at typical screen sizes.
 */
export const IMAGE_SLOTS = {
  heroImage: {
    label: "Hero Image",
    description: "Header behind the project title, and the home page slider (if selected there).",
    recommended: { width: 1920, height: 1080 },
    placements: [
      { label: "Project header · desktop", ratio: 1440 / 547, overlay: true },
      { label: "Project header · mobile", ratio: 375 / 340, overlay: true },
      { label: "Home slider · desktop", ratio: 1440 / 900 },
      { label: "Home slider · mobile", ratio: 390 / 844 },
    ],
  },
  img: {
    label: "Listing Image",
    description: "Project card on the Projects page and in the home page portfolio carousel.",
    recommended: { width: 1600, height: 1200 },
    placements: [
      { label: "Projects page & mobile carousel", ratio: 4 / 3 },
      { label: "Home carousel · center", ratio: 705 / 570 },
      { label: "Home carousel · sides", ratio: 345 / 470 },
    ],
  },
  mainImage: {
    label: "Main Image",
    description: "First large image under the header on the project page.",
    recommended: { width: 1920, height: 1080 },
    placements: [
      { label: "Large desktop", ratio: 1856 / 750 },
      { label: "Laptop", ratio: 1376 / 650 },
      { label: "Tablet", ratio: 704 / 650 },
      { label: "Mobile", ratio: 4 / 3 },
    ],
  },
  designImage1: {
    label: "Design Image 1",
    description: "Left column beside “The Design Story” text.",
    recommended: { width: 1200, height: 1600 },
    placements: [
      { label: "Desktop", ratio: 443 / 620 },
      { label: "Tablet", ratio: 219 / 500 },
      { label: "Mobile", ratio: 327 / 240 },
    ],
  },
  designImage2: {
    label: "Design Image 2",
    description: "Right column beside “The Design Story” text.",
    recommended: { width: 1200, height: 1600 },
    placements: [
      { label: "Desktop", ratio: 443 / 620 },
      { label: "Tablet", ratio: 219 / 500 },
      { label: "Mobile", ratio: 327 / 240 },
    ],
  },
  wideImage: {
    label: "Wide Image",
    description: "Full-width image near the bottom of the project page, above “Our Approach”.",
    recommended: { width: 1920, height: 1080 },
    placements: [
      { label: "Large desktop", ratio: 1856 / 800 },
      { label: "Laptop", ratio: 1376 / 800 },
      { label: "Tablet", ratio: 704 / 650 },
      { label: "Mobile", ratio: 327 / 220 },
    ],
  },
};
