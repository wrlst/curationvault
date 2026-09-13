export type Reference = {
  slug: string;
  title: string;
  category: string;
  creator?: {
    name: string;
    url?: string;
  };
  location?: string;
  year?: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  source?: {
    label: string;
    url: string;
  };
};

export const references: Reference[] = [
  // =========================
  // ARCHITECTURE
  // =========================

{
  slug: "reference-one",
  title: "Reference One",
  category: "Architecture",
  creator: {
    name: "Unknown",
  },
  location: "Location",
  year: "Year",
  image: "/images/architecture-01.png",
  imageWidth: 1704,
  imageHeight: 2556,
},

  {
    slug: "reference-two",
    title: "Reference Two",
    category: "Architecture",
    creator: { name: "Unknown" },
    location: "Location",
    year: "Year",
  },

  {
    slug: "reference-three",
    title: "Reference Three",
    category: "Architecture",
    creator: { name: "Unknown" },
    location: "Location",
    year: "Year",
  },

  {
    slug: "reference-four",
    title: "Reference Four",
    category: "Architecture",
    creator: { name: "Unknown" },
    location: "Location",
    year: "Year",
  },

  {
    slug: "reference-five",
    title: "Reference Five",
    category: "Architecture",
    creator: { name: "Unknown" },
    location: "Location",
    year: "Year",
  },

  {
    slug: "reference-six",
    title: "Reference Six",
    category: "Architecture",
    creator: { name: "Unknown" },
    location: "Location",
    year: "Year",
  },

  // =========================
  // INTERIOR SPACES
  // =========================

  {
    slug: "interior-reference-one",
    title: "Reference One",
    category: "Interior Spaces",
    location: "Location",
    year: "Year",
  },

  {
    slug: "interior-reference-two",
    title: "Reference Two",
    category: "Interior Spaces",
    location: "Location",
    year: "Year",
  },

  {
    slug: "interior-reference-three",
    title: "Reference Three",
    category: "Interior Spaces",
    location: "Location",
    year: "Year",
  },

  {
    slug: "interior-reference-four",
    title: "Reference Four",
    category: "Interior Spaces",
    location: "Location",
    year: "Year",
  },

  {
    slug: "interior-reference-five",
    title: "Reference Five",
    category: "Interior Spaces",
    location: "Location",
    year: "Year",
  },

  {
    slug: "interior-reference-six",
    title: "Reference Six",
    category: "Interior Spaces",
    location: "Location",
    year: "Year",
  },

  // =========================
  // OBJECTS
  // =========================

  {
    slug: "object-reference-one",
    title: "Reference One",
    category: "Objects",
    location: "Location",
    year: "Year",
  },

  {
    slug: "object-reference-two",
    title: "Reference Two",
    category: "Objects",
    location: "Location",
    year: "Year",
  },

  {
    slug: "object-reference-three",
    title: "Reference Three",
    category: "Objects",
    location: "Location",
    year: "Year",
  },

  {
    slug: "object-reference-four",
    title: "Reference Four",
    category: "Objects",
    location: "Location",
    year: "Year",
  },

  {
    slug: "object-reference-five",
    title: "Reference Five",
    category: "Objects",
    location: "Location",
    year: "Year",
  },

  {
    slug: "object-reference-six",
    title: "Reference Six",
    category: "Objects",
    location: "Location",
    year: "Year",
  },
];

export const architectureReferences = references.filter(
  (reference) => reference.category === "Architecture"
);

export const interiorSpaceReferences = references.filter(
  (reference) => reference.category === "Interior Spaces"
);

export const objectReferences = references.filter(
  (reference) => reference.category === "Objects"
);

export function getReferencesForCollection(title: string) {
  return references.filter((reference) => reference.category === title);
}
