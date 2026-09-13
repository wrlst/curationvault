export type Subcategory = {
  slug: string;
  title: string;
  collection: string;
  description?: string;
};

// This is the shared taxonomy for the public site, admin form, and API validation.
export const subcategories: Subcategory[] = [
  { slug: "residential", title: "Residential", collection: "architecture", description: "Houses and other places to live." },
  { slug: "commercial", title: "Commercial", collection: "architecture", description: "Architecture for work, exchange, and public life." },
  { slug: "tiny-homes", title: "Tiny Homes", collection: "architecture", description: "Living with a smaller footprint." },
  { slug: "remodels", title: "Remodels", collection: "architecture", description: "Existing buildings considered anew." },
  { slug: "modernism", title: "Modernism", collection: "architecture", description: "Modernist forms, spaces, and approaches." },
  { slug: "concepts", title: "Concepts", collection: "architecture", description: "Ideas and proposals for the built world." },
  { slug: "living-rooms", title: "Living Rooms", collection: "interior-spaces", description: "Spaces for gathering, resting, and everyday life." },
  { slug: "kitchens", title: "Kitchens", collection: "interior-spaces", description: "Spaces shaped around preparation and use." },
  { slug: "bathrooms", title: "Bathrooms", collection: "interior-spaces", description: "Quiet spaces of utility and ritual." },
  { slug: "studios", title: "Studios", collection: "interior-spaces", description: "Places made for thinking and making." },
  { slug: "retail", title: "Retail", collection: "interior-spaces", description: "Interiors for display and exchange." },
  { slug: "hospitality", title: "Hospitality", collection: "interior-spaces", description: "Spaces for welcoming and staying." },
  { slug: "material-studies", title: "Material Studies", collection: "interior-spaces", description: "Texture, finish, and material relationships." },
  { slug: "furniture", title: "Furniture", collection: "objects", description: "Forms made for living with." },
  { slug: "lighting", title: "Lighting", collection: "objects", description: "Objects that shape how light is held and shared." },
  { slug: "ceramics", title: "Ceramics", collection: "objects", description: "Vessels and forms in fired clay." },
  { slug: "home-accessories", title: "Home Accessories", collection: "objects", description: "Considered details for domestic spaces." },
  { slug: "everyday-objects", title: "Everyday Objects", collection: "objects", description: "The familiar things worth looking at again." },
];

export function getSubcategoriesForCollection(collection: string) {
  return subcategories.filter((subcategory) => subcategory.collection === collection);
}

export function getSubcategory(collection: string, slug: string) {
  return subcategories.find(
    (subcategory) => subcategory.collection === collection && subcategory.slug === slug
  );
}
