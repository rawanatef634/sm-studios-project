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
};
