export type Project = {
  id: number;
  title: string;
  breadcrumb: string;
  heroImage?: string;
  img?: string;
  mainImage?: string;
  state: string;
  town: string;
  area: string;
  designImages?: [string?, string?];
  story: string;
  wideImage?: string;
  approach?: string;
  category?: string;
  /** Focal point (0–100 %) and zoom (1–2.5) per image slot, set in the dashboard. */
  imageFraming?: Partial<
    Record<
      | "heroImage"
      | "img"
      | "mainImage"
      | "wideImage"
      | "designImage1"
      | "designImage2",
      { x: number; y: number; zoom: number }
    >
  >;
};
