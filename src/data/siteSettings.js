/**
 * Admin-editable site settings. Shared by the frontend (defaults) and the API
 * (validation + seed). Stored overrides live in Blob at sm-studios/settings.json.
 */

export const DEFAULT_CATEGORIES = [
  "Interior Design",
  "Architecture Design",
  "Interior Fit-Outs",
];

/** Garden Cafe, Off White, Dental Hub — high-resolution photography. */
export const DEFAULT_HERO_PROJECT_IDS = [5, 4, 6];

export const MAX_HERO_PROJECTS = 6;
export const MAX_CATEGORIES = 20;
export const MAX_CATEGORY_LENGTH = 60;
export const MAX_CONTENT_LENGTH = 3000;

/**
 * Every editable text on the public site. `multiline` texts keep line breaks.
 * @type {{ key: string, section: string, label: string, default: string, multiline?: boolean }[]}
 */
export const CONTENT_FIELDS = [
  // Home — services strip
  { key: "home.services.label", section: "Home — Services", label: "Small label", default: "Our Expertise" },
  { key: "home.services.title", section: "Home — Services", label: "Heading", default: "From concept to completion" },
  { key: "home.services.link", section: "Home — Services", label: "Link text", default: "Explore Our Services" },

  // Services (home cards + services page)
  { key: "service.interior-design.title", section: "Services", label: "Interior Design — title", default: "Interior Design" },
  { key: "service.interior-design.text", section: "Services", label: "Interior Design — description", multiline: true, default: "Interior design is the art and science of enhancing the interior of a building to achieve a healthier and more aesthetically pleasing environment for the people using the space. An interior designer is someone who plans, researches, coordinates, and manages such projects." },
  { key: "service.architecture-design.title", section: "Services", label: "Architecture Design — title", default: "Architecture Design" },
  { key: "service.architecture-design.text", section: "Services", label: "Architecture Design — description", multiline: true, default: "Architecture is both the process and the product of planning, designing, and constructing buildings or any other structures. Architectural works, in the material form of buildings, are often perceived as cultural symbols and as works of art." },
  { key: "service.interior-fit-outs.title", section: "Services", label: "Interior Fit-Outs — title", default: "Interior Fit-Outs" },
  { key: "service.interior-fit-outs.text", section: "Services", label: "Interior Fit-Outs — description", multiline: true, default: "Interior fit-outs for commercial, residential, retail and hospitality projects. Our team works relentlessly to deliver cost-effective solutions to fulfil the client’s needs. By the use of high-quality materials, and cutting-edge technology, we create interior environments that connect, inspire the people." },

  // Service detail pages
  { key: "service.interior-design.about", section: "Service pages", label: "Interior Design — About this service", multiline: true, default: "Interior design is the art and science of enhancing the interior of a building to achieve a healthier and more aesthetically pleasing environment for the people using the space. An interior designer is someone who plans, researches, coordinates, and manages such projects." },
  { key: "service.architecture-design.about", section: "Service pages", label: "Architecture Design — About this service", multiline: true, default: "Architecture design blends functionality with creativity to deliver timeless spaces that serve people and communities. We focus on sustainability and cultural relevance in every project." },
  { key: "service.interior-fit-outs.about", section: "Service pages", label: "Interior Fit-Outs — About this service", multiline: true, default: "Interior fit-outs ensure every detail is executed perfectly, from materials to finishes, delivering a ready-to-use functional space." },

  // Home — about
  { key: "home.about.label", section: "Home — About", label: "Small label", default: "About SM Studios" },
  { key: "home.about.title", section: "Home — About", label: "Heading", multiline: true, default: "WE CREATE INTERIORS WITH\nPRECISION." },
  { key: "home.about.body", section: "Home — About", label: "Paragraph", multiline: true, default: "As a premier Omani establishment headquartered in Muscat, our firm specializes in the dynamic realm of interior architecture design. Our unwavering commitment is centered around propelling this industry towards unparalleled development through the strategic integration of cutting-edge technology." },
  { key: "home.about.button", section: "Home — About", label: "Button text", default: "Meet Our Team" },

  // Home — team
  { key: "home.team.label", section: "Home — Team", label: "Small label", default: "MEET THE OWNERS" },
  { key: "home.team.title", section: "Home — Team", label: "Heading", multiline: true, default: "The vision of SM Studios comes from the passion and creativity of its founders." },

  // Call to action (bottom of most pages)
  { key: "cta.title", section: "Get in touch banner", label: "Heading", multiline: true, default: "LET’S CREATE YOUR\nNEXT SPACE" },
  { key: "cta.body", section: "Get in touch banner", label: "Paragraph", multiline: true, default: "Our team is ready to turn your vision into a reality with designs that inspire and last." },
  { key: "cta.button", section: "Get in touch banner", label: "Button text", default: "GET IN TOUCH" },

  // Contact page
  { key: "contact.intro", section: "Contact page", label: "Intro text", multiline: true, default: "Let's discuss your next project. Our team is ready to bring your ideas to life." },

  // Footer
  { key: "footer.location", section: "Footer", label: "Address", multiline: true, default: "207 Office, 2nd Second floor, Bowsher, Muscat, Sultanate of Oman" },
  { key: "footer.email", section: "Footer", label: "Email", default: "info@smstudios-om.com" },
  { key: "footer.phone1", section: "Footer", label: "Phone 1", default: "+968 2412 8488" },
  { key: "footer.phone2", section: "Footer", label: "Phone 2", default: "+968 78444636" },
  { key: "footer.copyright", section: "Footer", label: "Copyright line", default: "© 2025 SM STUDIOS. ALL RIGHTS RESERVED." },
];

export const CONTENT_DEFAULTS = Object.fromEntries(
  CONTENT_FIELDS.map((field) => [field.key, field.default]),
);

export const DEFAULT_SETTINGS = {
  categories: DEFAULT_CATEGORIES,
  heroProjectIds: DEFAULT_HERO_PROJECT_IDS,
  content: {},
};
