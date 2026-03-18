// src/data/servicesDetails.js

export const servicesDetails = {
  "interior-design": {
    title: "Interior Design",
    breadcrumb: "HOME / SERVICES / INTERIOR DESIGN",
    backgroundImage: "/assets/interior-design.jpg",
    about:
      "Interior design is the art and science of enhancing the interior of a building to achieve a healthier and more aesthetically pleasing environment for the people using the space. An interior designer is someone who plans, researches, coordinates, and manages such projects. ",
    image: "/assets/interior-design.jpg",
    subServices: [
      {
        key: "residential",
        title: "Residential Design",
        content:
          "From apartments to villas, we design homes that reflect comfort and personal style.",
      },
      {
        key: "commercial",
        title: "Commercial Design",
        content:
          "Smart, functional designs for offices, shops and commercial spaces.",
      },
      {
        key: "hospitality",
        title: "Hospitality Design",
        content:
          "From apartments to villas, we design homes that reflect comfort and personal style.",
      },
    ],
  },

  "architecture-design": {
    title: "Architecture Design",
    breadcrumb: "HOME / SERVICES / ARCHITECTURE DESIGN",
    backgroundImage: "/assets/architecture.jpg",
    about:
      "Architecture design blends functionality with creativity to deliver timeless spaces that serve people and communities. We focus on sustainability and cultural relevance in every project.",
    image: "/assets/architecture.jpg",
    subServices: [
      {
        key: "conceptual",
        title: "Conceptual Design",
        content:
          "Creating innovative and functional concepts aligned with client vision.",
      },
      {
        key: "structural",
        title: "Structural Planning",
        content:
          "Precise planning and detailing to ensure safety and durability.",
      },
      {
        key: "sustainable",
        title: "Sustainable Design",
        content: "Eco-conscious designs that minimize environmental impact.",
      },
    ],
  },

  "3d-visualization": {
    title: "3D Visualization",
    breadcrumb: "HOME / SERVICES / 3D VISUALIZATION",
    backgroundImage: "/assets/3d-vis.png",
    about:
      "3D visualization brings ideas to life with photorealistic renders and immersive walkthroughs, helping clients envision their projects before execution.",
    image: "/assets/3d-vis.png",
    subServices: [
      {
        key: "renders",
        title: "3D Renders",
        content:
          "High-quality renders to showcase materials, lighting, and design.",
      },
      {
        key: "animation",
        title: "3D Animation",
        content:
          "Walkthroughs and flythroughs for a more immersive experience.",
      },
      {
        key: "vr",
        title: "Virtual Reality",
        content:
          "Interactive VR experiences to fully explore spaces before they’re built.",
      },
    ],
  },

  "interior-fit-outs": {
    title: "Interior Fit-Outs",
    breadcrumb: "HOME / SERVICES / INTERIOR FIT-OUTS",
    backgroundImage: "/assets/interior-d.png",
    about:
      "Interior fit-outs ensure every detail is executed perfectly, from materials to finishes, delivering a ready-to-use functional space.",
    image: "/assets/interior-d.png",
    subServices: [
      {
        key: "residential-fit",
        title: "Residential Fit-Outs",
        content:
          "Turnkey interiors for homes, ensuring quality and elegance.",
      },
      {
        key: "commercial-fit",
        title: "Commercial Fit-Outs",
        content:
          "Tailored office and retail fit-outs that optimize usability.",
      },
      {
        key: "luxury-fit",
        title: "Luxury Fit-Outs",
        content:
          "Premium finishes and detailing for high-end clients.",
      },
    ],
  },
};

// Shared process steps (reusable across all services)
export const processSteps = [
  { title: "Site Visit", desc: "We begin by visiting the space to understand its dimensions, potential, and unique characteristics." },
  { title: "Space Plan", desc: "Our team develops functional layouts to maximize flow, comfort, and efficiency." },
  { title: "Mood Board", desc: "We create mood boards to define the visual direction — colors, textures, and inspiration." },
  { title: "3D Modeling", desc: "Realistic 3D renders help you visualize the final design before execution." },
  { title: "Detail Drawings", desc: "Technical drawings provide precision and clarity for contractors and execution" },
  { title: "BOQ", desc: "We prepare a detailed BOQ to ensure cost transparency and accurate budgeting." },
];
