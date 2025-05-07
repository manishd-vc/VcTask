export type TileSize = {
  width: number;
  height: number;
  unit: "mm" | "cm" | "inch";
};

export type TileType =
  | "ceramic"
  | "porcelain"
  | "vitrified"
  | "marble"
  | "granite"
  | "mosaic"
  | "other";

export type RoomType =
  | "bathroom"
  | "kitchen"
  | "living room"
  | "bedroom"
  | "outdoor"
  | "commercial"
  | "other";

export type TileFinish =
  | "glossy"
  | "matte"
  | "textured"
  | "polished"
  | "rustic"
  | "satin"
  | "other";

export type Product = {
  id: string;
  name: string;
  description: string;
  tileType: TileType;
  roomTypes: RoomType[];
  sizes: TileSize[];
  colors: string[];
  patterns: string[];
  finishes: TileFinish[];
  priceRange?: {
    min: number;
    max: number;
  };
  contactForPrice: boolean;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  images: string[];
  thumbnail: string;
  specifications: {
    thickness: number;
    material: string;
    waterResistance: "low" | "medium" | "high";
    slipResistance: "low" | "medium" | "high";
    maintenanceLevel: "low" | "medium" | "high";
    [key: string]: any;
  };
  featured: boolean;
  new: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  subCategories?: Category[];
};

export type CustomerInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  productId?: string;
  createdAt: string;
};

export type CompletedProject = {
  id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  products: string[]; // productIds
  completedDate: string;
};

export type Testimonial = {
  id: string;
  customerName: string;
  customerDesignation?: string;
  rating: number;
  text: string;
  projectId?: string;
  date: string;
};

export type StoreLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  openingHours: {
    day: string;
    hours: string;
  }[];
};

export type CompanyInfo = {
  name: string;
  tagline: string;
  description: string;
  history: string;
  values: string[];
  advantages: string[];
  logo: string;
  contactInfo: {
    phone: string;
    email: string;
    whatsapp: string;
    website: string;
    socialMedia: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
  locations: StoreLocation[];
};
