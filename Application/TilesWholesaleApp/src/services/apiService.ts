import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Category,
  CompanyInfo,
  CompletedProject,
  CustomerInquiry,
  Product,
  Testimonial,
} from "../types";
import {
  sampleCategories,
  sampleCompletedProjects,
  sampleProducts,
  sampleTestimonials,
} from "./sampleData";

// For demo purposes, we'll use AsyncStorage to simulate a backend.
// In a production app, this would be replaced with actual API calls.

// Sample data keys
const KEYS = {
  PRODUCTS: "tiles_products",
  CATEGORIES: "tiles_categories",
  COMPANY_INFO: "tiles_company_info",
  TESTIMONIALS: "tiles_testimonials",
  PROJECTS: "tiles_projects",
  INQUIRIES: "tiles_inquiries",
};

// Error handling wrapper
const handleApiCall = async <T>(
  apiCall: () => Promise<T>,
  errorMessage: string
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const data = await apiCall();
    return { data, error: null };
  } catch (error) {
    console.error(`API Error: ${errorMessage}`, error);
    return { data: null, error: errorMessage };
  }
};

// Products API
export const productApi = {
  getProducts: async () => {
    return handleApiCall(async () => {
      const data = await AsyncStorage.getItem(KEYS.PRODUCTS);
      if (!data) return [];
      return JSON.parse(data) as Product[];
    }, "Failed to fetch products");
  },

  getProductById: async (id: string) => {
    return handleApiCall(async () => {
      const data = await AsyncStorage.getItem(KEYS.PRODUCTS);
      if (!data) return null;
      const products = JSON.parse(data) as Product[];
      return products.find((product) => product.id === id) || null;
    }, `Failed to fetch product with ID ${id}`);
  },

  saveProduct: async (product: Product) => {
    return handleApiCall(async () => {
      const data = await AsyncStorage.getItem(KEYS.PRODUCTS);
      const products = data ? (JSON.parse(data) as Product[]) : [];

      const existingIndex = products.findIndex((p) => p.id === product.id);
      if (existingIndex >= 0) {
        products[existingIndex] = product;
      } else {
        products.push(product);
      }

      await AsyncStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
      return product;
    }, "Failed to save product");
  },

  deleteProduct: async (id: string) => {
    return handleApiCall(async () => {
      const data = await AsyncStorage.getItem(KEYS.PRODUCTS);
      if (!data) return false;

      const products = JSON.parse(data) as Product[];
      const filteredProducts = products.filter((product) => product.id !== id);

      await AsyncStorage.setItem(
        KEYS.PRODUCTS,
        JSON.stringify(filteredProducts)
      );
      return true;
    }, `Failed to delete product with ID ${id}`);
  },

  // Category operations
  getCategories: async () => {
    return handleApiCall(async () => {
      const data = await AsyncStorage.getItem(KEYS.CATEGORIES);
      if (!data) return [];
      return JSON.parse(data) as Category[];
    }, "Failed to fetch categories");
  },
};

// Company info API
export const companyApi = {
  getCompanyInfo: async () => {
    return handleApiCall(async () => {
      const data = await AsyncStorage.getItem(KEYS.COMPANY_INFO);
      if (!data) return null;
      return JSON.parse(data) as CompanyInfo;
    }, "Failed to fetch company information");
  },

  saveCompanyInfo: async (info: CompanyInfo) => {
    return handleApiCall(async () => {
      await AsyncStorage.setItem(KEYS.COMPANY_INFO, JSON.stringify(info));
      return info;
    }, "Failed to save company information");
  },

  getTestimonials: async () => {
    return handleApiCall(async () => {
      const data = await AsyncStorage.getItem(KEYS.TESTIMONIALS);
      if (!data) return [];
      return JSON.parse(data) as Testimonial[];
    }, "Failed to fetch testimonials");
  },

  getCompletedProjects: async () => {
    return handleApiCall(async () => {
      const data = await AsyncStorage.getItem(KEYS.PROJECTS);
      if (!data) return [];
      return JSON.parse(data) as CompletedProject[];
    }, "Failed to fetch completed projects");
  },
};

// Customer inquiries API
export const inquiryApi = {
  submitInquiry: async (inquiry: Omit<CustomerInquiry, "id" | "createdAt">) => {
    return handleApiCall(async () => {
      const data = await AsyncStorage.getItem(KEYS.INQUIRIES);
      const inquiries = data ? (JSON.parse(data) as CustomerInquiry[]) : [];

      const newInquiry: CustomerInquiry = {
        ...inquiry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      inquiries.push(newInquiry);
      await AsyncStorage.setItem(KEYS.INQUIRIES, JSON.stringify(inquiries));

      return newInquiry;
    }, "Failed to submit inquiry");
  },

  getInquiries: async () => {
    return handleApiCall(async () => {
      const data = await AsyncStorage.getItem(KEYS.INQUIRIES);
      if (!data) return [];
      return JSON.parse(data) as CustomerInquiry[];
    }, "Failed to fetch inquiries");
  },
};

// Initialize with some sample data
let isInitializing = false;

export const initializeAppData = async () => {
  try {
    // Prevent multiple initialization calls running in parallel
    if (isInitializing) {
      console.log("App data initialization already in progress");
      return;
    }

    isInitializing = true;

    // Check if data is already initialized
    const dataInitialized = await AsyncStorage.getItem("data_initialized");
    if (dataInitialized === "true") {
      console.log("App data already initialized");
      isInitializing = false;
      return; // Already initialized
    }

    console.log("Initializing sample data...");

    // Sample company info data
    const companyInfo: CompanyInfo = {
      name: "Premium Tiles Wholesale",
      tagline: "Quality Tiles for Every Space",
      description:
        "Premium Tiles Wholesale is Ahmedabad's leading supplier of high-quality tiles for residential and commercial spaces.",
      history:
        "Established in 2010, Premium Tiles Wholesale has been serving customers across Gujarat with the finest selection of imported and domestic tiles.",
      values: [
        "Quality Excellence",
        "Customer Satisfaction",
        "Innovative Designs",
        "Professional Service",
      ],
      advantages: [
        "Largest collection of premium tiles in Gujarat",
        "Direct import from leading international manufacturers",
        "Experienced consultants to help with selection",
        "Wholesale pricing for retail customers",
        "Free samples and design consultation",
      ],
      logo: "https://example.com/logo.png",
      contactInfo: {
        phone: "+91 9876543210",
        email: "info@premiumtiles.com",
        whatsapp: "+91 9876543210",
        website: "www.premiumtiles.com",
        socialMedia: {
          facebook: "https://facebook.com/premiumtiles",
          instagram: "https://instagram.com/premiumtiles",
          twitter: "https://twitter.com/premiumtiles",
          linkedin: "https://linkedin.com/company/premiumtiles",
        },
      },
      locations: [
        {
          id: "1",
          name: "Premium Tiles Wholesale - Main Showroom",
          address: "123 Tile Market, Satellite",
          city: "Ahmedabad",
          state: "Gujarat",
          pincode: "380015",
          phone: "+91 9876543210",
          email: "info@premiumtiles.com",
          coordinates: {
            latitude: 23.0225,
            longitude: 72.5714,
          },
          openingHours: [
            { day: "Monday-Saturday", hours: "10:00 AM - 8:00 PM" },
            { day: "Sunday", hours: "Closed" },
          ],
        },
      ],
    };

    // Initialize with sample data
    await AsyncStorage.setItem(KEYS.COMPANY_INFO, JSON.stringify(companyInfo));
    await AsyncStorage.setItem(KEYS.PRODUCTS, JSON.stringify(sampleProducts));
    await AsyncStorage.setItem(
      KEYS.CATEGORIES,
      JSON.stringify(sampleCategories)
    );
    await AsyncStorage.setItem(
      KEYS.TESTIMONIALS,
      JSON.stringify(sampleTestimonials)
    );
    await AsyncStorage.setItem(
      KEYS.PROJECTS,
      JSON.stringify(sampleCompletedProjects)
    );

    // Mark data as initialized
    await AsyncStorage.setItem("data_initialized", "true");

    console.log("Sample data initialized successfully");
  } catch (error) {
    console.error("Failed to initialize sample data", error);
  } finally {
    isInitializing = false;
  }
};
