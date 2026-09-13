export type Collection = {
  slug: string;
  number: string;
  title: string;
  description: string;
};

export const collections: Collection[] = [
  {
    slug: "architecture",
    number: "01",
    title: "Architecture",
    description:
      "Buildings, houses, structures, plans, materials, and architectural details.",
  },
  {
    slug: "interior-spaces",
    number: "02",
    title: "Interior Spaces",
    description:
      "Rooms, interiors, kitchens, studios, materials, and spatial details.",
  },
  {
    slug: "objects",
    number: "03",
    title: "Objects",
    description:
      "Furniture, lighting, tools, ceramics, products, and everyday objects.",
  },
];