import { Product, Category, CompletedProject, Testimonial } from "../types";

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Royal White Marble",
    description:
      "Premium white marble tiles with subtle gray veining, perfect for elegant living spaces.",
    tileType: "marble",
    roomTypes: ["living room", "bathroom", "kitchen"],
    sizes: [
      { width: 600, height: 600, unit: "mm" },
      { width: 800, height: 800, unit: "mm" },
    ],
    colors: ["White", "Light Gray"],
    patterns: ["Veined"],
    finishes: ["polished", "matte"],
    priceRange: {
      min: 1200,
      max: 1800,
    },
    contactForPrice: false,
    stockStatus: "in-stock",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618219944342-824e40a13285?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618219740975-d40e5a01c04a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specifications: {
      thickness: 10,
      material: "Natural Marble",
      waterResistance: "medium",
      slipResistance: "medium",
      maintenanceLevel: "high",
    },
    featured: true,
    new: false,
    createdAt: "2023-05-15T00:00:00Z",
    updatedAt: "2023-05-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Modern Gray Porcelain",
    description:
      "Sleek and durable gray porcelain tiles with a contemporary look for modern interiors.",
    tileType: "porcelain",
    roomTypes: ["bathroom", "kitchen", "commercial"],
    sizes: [
      { width: 300, height: 600, unit: "mm" },
      { width: 600, height: 600, unit: "mm" },
    ],
    colors: ["Gray", "Dark Gray"],
    patterns: ["Solid"],
    finishes: ["matte", "textured"],
    priceRange: {
      min: 800,
      max: 1200,
    },
    contactForPrice: false,
    stockStatus: "in-stock",
    images: [
      "https://images.unsplash.com/photo-1600607291525-f187a98dd5a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687644-8e825cedd7ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1600607291525-f187a98dd5a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specifications: {
      thickness: 9,
      material: "Porcelain",
      waterResistance: "high",
      slipResistance: "high",
      maintenanceLevel: "low",
    },
    featured: true,
    new: true,
    createdAt: "2023-08-10T00:00:00Z",
    updatedAt: "2023-08-10T00:00:00Z",
  },
  {
    id: "3",
    name: "Classic Terracotta",
    description:
      "Rustic terracotta ceramic tiles bringing warmth and traditional charm to any space.",
    tileType: "ceramic",
    roomTypes: ["outdoor", "kitchen"],
    sizes: [
      { width: 200, height: 200, unit: "mm" },
      { width: 300, height: 300, unit: "mm" },
    ],
    colors: ["Orange", "Brick Red"],
    patterns: ["Rustic"],
    finishes: ["matte", "textured"],
    priceRange: {
      min: 600,
      max: 900,
    },
    contactForPrice: false,
    stockStatus: "low-stock",
    images: [
      "https://images.unsplash.com/photo-1596825605376-4a4a5550140a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596825397437-7486c7f11b9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596825397145-5318bad79f82?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1596825605376-4a4a5550140a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specifications: {
      thickness: 8,
      material: "Ceramic",
      waterResistance: "medium",
      slipResistance: "high",
      maintenanceLevel: "medium",
    },
    featured: false,
    new: false,
    createdAt: "2023-04-20T00:00:00Z",
    updatedAt: "2023-04-20T00:00:00Z",
  },
  {
    id: "4",
    name: "Premium Vitrified Pearl",
    description:
      "High-gloss, durable vitrified tiles with pearlescent finish for luxury commercial and residential spaces.",
    tileType: "vitrified",
    roomTypes: ["living room", "commercial", "bedroom"],
    sizes: [
      { width: 800, height: 800, unit: "mm" },
      { width: 1200, height: 600, unit: "mm" },
    ],
    colors: ["Pearl White", "Beige"],
    patterns: ["Glossy"],
    finishes: ["glossy", "polished"],
    contactForPrice: true,
    stockStatus: "in-stock",
    images: [
      "https://images.unsplash.com/photo-1600566752355-c4ddb5d49c5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566752579-ba76a694d6e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1600566752355-c4ddb5d49c5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specifications: {
      thickness: 12,
      material: "Vitrified Ceramic",
      waterResistance: "high",
      slipResistance: "low",
      maintenanceLevel: "low",
    },
    featured: true,
    new: true,
    createdAt: "2023-09-05T00:00:00Z",
    updatedAt: "2023-09-05T00:00:00Z",
  },
  {
    id: "5",
    name: "Natural Granite Black",
    description:
      "Elegant black granite tiles with natural variations for a sophisticated statement in any space.",
    tileType: "granite",
    roomTypes: ["kitchen", "commercial", "bathroom"],
    sizes: [
      { width: 600, height: 600, unit: "mm" },
      { width: 600, height: 300, unit: "mm" },
    ],
    colors: ["Black", "Dark Grey"],
    patterns: ["Speckled"],
    finishes: ["polished", "flamed"],
    priceRange: {
      min: 1500,
      max: 2200,
    },
    contactForPrice: false,
    stockStatus: "in-stock",
    images: [
      "https://images.unsplash.com/photo-1603936592559-28bea86ace7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603936592621-aae7629dbc1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603936592393-62e97b3e75a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1603936592559-28bea86ace7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specifications: {
      thickness: 20,
      material: "Natural Granite",
      waterResistance: "high",
      slipResistance: "medium",
      maintenanceLevel: "medium",
    },
    featured: false,
    new: true,
    createdAt: "2023-10-12T00:00:00Z",
    updatedAt: "2023-10-12T00:00:00Z",
  },
  {
    id: "6",
    name: "Artisan Glass Mosaic",
    description:
      "Handcrafted glass mosaic tiles in vibrant blue tones for creating stunning feature walls and decorative accents.",
    tileType: "mosaic",
    roomTypes: ["bathroom", "kitchen"],
    sizes: [{ width: 300, height: 300, unit: "mm" }],
    colors: ["Blue", "Teal", "Aqua"],
    patterns: ["Mosaic"],
    finishes: ["glossy"],
    priceRange: {
      min: 2000,
      max: 2800,
    },
    contactForPrice: false,
    stockStatus: "low-stock",
    images: [
      "https://images.unsplash.com/photo-1551776222-a563ff2b1878?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551776222-85d6dd7f9488?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551776222-64ac9d3617b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1551776222-a563ff2b1878?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specifications: {
      thickness: 6,
      material: "Glass",
      waterResistance: "high",
      slipResistance: "medium",
      maintenanceLevel: "medium",
    },
    featured: true,
    new: false,
    createdAt: "2023-07-03T00:00:00Z",
    updatedAt: "2023-07-03T00:00:00Z",
  },
  {
    id: "7",
    name: "Wooden Finish Ceramic",
    description:
      "Ceramic tiles with realistic wood grain finish, combining the beauty of hardwood with the durability of ceramic.",
    tileType: "ceramic",
    roomTypes: ["living room", "bedroom", "commercial"],
    sizes: [
      { width: 200, height: 1200, unit: "mm" },
      { width: 200, height: 800, unit: "mm" },
    ],
    colors: ["Brown", "Oak", "Walnut"],
    patterns: ["Wood Grain"],
    finishes: ["textured", "matte"],
    priceRange: {
      min: 900,
      max: 1300,
    },
    contactForPrice: false,
    stockStatus: "in-stock",
    images: [
      "https://images.unsplash.com/photo-1600566753343-a4d3e3022d20?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753230-135baffba890?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1600566753343-a4d3e3022d20?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specifications: {
      thickness: 9,
      material: "Ceramic",
      waterResistance: "medium",
      slipResistance: "medium",
      maintenanceLevel: "low",
    },
    featured: false,
    new: true,
    createdAt: "2023-09-25T00:00:00Z",
    updatedAt: "2023-09-25T00:00:00Z",
  },
  {
    id: "8",
    name: "Premium Italian Marble",
    description:
      "Luxurious imported Italian marble tiles with stunning natural patterns for high-end residential and commercial projects.",
    tileType: "marble",
    roomTypes: ["living room", "commercial"],
    sizes: [
      { width: 800, height: 800, unit: "mm" },
      { width: 1200, height: 1200, unit: "mm" },
    ],
    colors: ["Cream", "Beige", "Gold"],
    patterns: ["Veined"],
    finishes: ["polished", "honed"],
    contactForPrice: true,
    stockStatus: "in-stock",
    images: [
      "https://images.unsplash.com/photo-1618219740975-d40e5a01c04a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618219846977-2b2c9b478053?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1618219740975-d40e5a01c04a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specifications: {
      thickness: 15,
      material: "Italian Marble",
      waterResistance: "medium",
      slipResistance: "low",
      maintenanceLevel: "high",
    },
    featured: true,
    new: false,
    createdAt: "2023-06-17T00:00:00Z",
    updatedAt: "2023-06-17T00:00:00Z",
  },
];

export const sampleCategories: Category[] = [
  {
    id: "1",
    name: "Floor Tiles",
    slug: "floor-tiles",
    description: "Durable and stylish floor tiles for every room",
    image:
      "https://images.unsplash.com/photo-1600607291525-f187a98dd5a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    subCategories: [
      {
        id: "1-1",
        name: "Living Room Tiles",
        slug: "living-room-tiles",
        description: "Premium tiles for your living spaces",
        image:
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        parentId: "1",
      },
      {
        id: "1-2",
        name: "Kitchen Tiles",
        slug: "kitchen-tiles",
        description: "Durable and easy to clean kitchen floor tiles",
        image:
          "https://images.unsplash.com/photo-1584346133934-7a7b89b30e85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        parentId: "1",
      },
      {
        id: "1-3",
        name: "Bathroom Tiles",
        slug: "bathroom-tiles",
        description: "Water-resistant tiles perfect for bathrooms",
        image:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        parentId: "1",
      },
    ],
  },
  {
    id: "2",
    name: "Wall Tiles",
    slug: "wall-tiles",
    description: "Beautiful wall tiles to enhance your interiors",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    subCategories: [
      {
        id: "2-1",
        name: "Kitchen Wall Tiles",
        slug: "kitchen-wall-tiles",
        description: "Stylish and easy to clean kitchen wall solutions",
        image:
          "https://images.unsplash.com/photo-1600566752788-3a5e6a79d61b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        parentId: "2",
      },
      {
        id: "2-2",
        name: "Bathroom Wall Tiles",
        slug: "bathroom-wall-tiles",
        description: "Moisture-resistant wall tiles for bathrooms",
        image:
          "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        parentId: "2",
      },
      {
        id: "2-3",
        name: "Decorative Wall Tiles",
        slug: "decorative-wall-tiles",
        description: "Beautiful accent tiles for feature walls",
        image:
          "https://images.unsplash.com/photo-1551776222-a563ff2b1878?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        parentId: "2",
      },
    ],
  },
  {
    id: "3",
    name: "Outdoor Tiles",
    slug: "outdoor-tiles",
    description: "Weather-resistant tiles for outdoor spaces",
    image:
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    subCategories: [
      {
        id: "3-1",
        name: "Patio Tiles",
        slug: "patio-tiles",
        description: "Durable tiles for your patio and outdoor living areas",
        image:
          "https://images.unsplash.com/photo-1591826422905-1cde132dc052?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        parentId: "3",
      },
      {
        id: "3-2",
        name: "Pool Tiles",
        slug: "pool-tiles",
        description: "Non-slip tiles perfect for pool surrounds",
        image:
          "https://images.unsplash.com/photo-1527672809634-04ed36500acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        parentId: "3",
      },
    ],
  },
  {
    id: "4",
    name: "Special Collections",
    slug: "special-collections",
    description: "Premium curated collections for distinctive spaces",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    subCategories: [
      {
        id: "4-1",
        name: "Designer Collections",
        slug: "designer-collections",
        description: "Exclusive designer tile collections",
        image:
          "https://images.unsplash.com/photo-1618219944342-824e40a13285?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        parentId: "4",
      },
      {
        id: "4-2",
        name: "Eco-Friendly Tiles",
        slug: "eco-friendly-tiles",
        description:
          "Sustainable tile options for environmentally conscious projects",
        image:
          "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        parentId: "4",
      },
    ],
  },
];

export const sampleCompletedProjects: CompletedProject[] = [
  {
    id: "1",
    title: "Luxury Villa Renovation",
    description:
      "Complete flooring and wall tiling renovation for a luxury villa in Ahmedabad.",
    location: "Ahmedabad, Gujarat",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566752788-3a5e6a79d61b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    products: ["1", "8"],
    completedDate: "2023-08-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Commercial Office Complex",
    description:
      "Complete flooring solution for a 5-story commercial office complex.",
    location: "Ahmedabad, Gujarat",
    images: [
      "https://images.unsplash.com/photo-1572025442646-866d16c84a54?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    products: ["2", "4", "5"],
    completedDate: "2023-05-20T00:00:00Z",
  },
  {
    id: "3",
    title: "Boutique Hotel",
    description:
      "Premium marble and decorative tile installation for a boutique hotel.",
    location: "Surat, Gujarat",
    images: [
      "https://images.unsplash.com/photo-1618219740975-d40e5a01c04a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551776222-a563ff2b1878?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    products: ["1", "6", "8"],
    completedDate: "2023-10-05T00:00:00Z",
  },
];

export const sampleTestimonials: Testimonial[] = [
  {
    id: "1",
    customerName: "Rajesh Shah",
    customerDesignation: "Property Developer",
    rating: 5,
    text: "Premium Tiles Wholesale provided exceptional service for our luxury apartment project. The quality of the marble tiles is outstanding, and they delivered on time despite our tight schedule.",
    projectId: "1",
    date: "2023-09-05T00:00:00Z",
  },
  {
    id: "2",
    customerName: "Priya Mehta",
    customerDesignation: "Interior Designer",
    rating: 5,
    text: "As an interior designer, I need reliable suppliers with a wide range of premium products. Premium Tiles has consistently delivered quality tiles for my clients. Their mosaic collection is particularly impressive.",
    projectId: "3",
    date: "2023-10-12T00:00:00Z",
  },
  {
    id: "3",
    customerName: "Amit Patel",
    customerDesignation: "Homeowner",
    rating: 4,
    text: "We renovated our entire home with tiles from Premium Tiles Wholesale. Their team was very helpful in guiding us through the selection process. The wood-finish ceramic tiles look amazing in our living room.",
    date: "2023-07-18T00:00:00Z",
  },
  {
    id: "4",
    customerName: "Vikram Sharma",
    customerDesignation: "Commercial Project Manager",
    rating: 5,
    text: "Premium Tiles Wholesale handled our large commercial project with professionalism. Their bulk pricing was competitive and the vitrified tiles we purchased have performed excellently under high traffic conditions.",
    projectId: "2",
    date: "2023-06-30T00:00:00Z",
  },
];
