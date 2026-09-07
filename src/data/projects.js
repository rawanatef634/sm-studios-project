/**
 * Home carousel / related-project cards.
 * IDs and titles come from projectsDetails so links always resolve.
 */
import { projects as allProjects } from "./projectsDetails";

export const projects = allProjects.map((p) => ({
  id: p.id,
  title: p.title,
  img: p.heroImage || p.mainImage,
  caption: p.story,
}));
