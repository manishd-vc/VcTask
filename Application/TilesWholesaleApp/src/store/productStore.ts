import { create } from "zustand";
import { Product, RoomType, TileFinish, TileType } from "../types";

interface ProductStoreState {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;

  // Filter states
  tileTypeFilter: TileType | null;
  roomTypeFilter: RoomType | null;
  sizeFilters: { min: number; max: number } | null;
  colorFilters: string[];
  patternFilters: string[];
  finishFilters: TileFinish[];
  priceRangeFilter: { min: number; max: number } | null;

  // Actions
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Filter actions
  setTileTypeFilter: (type: TileType | null) => void;
  setRoomTypeFilter: (type: RoomType | null) => void;
  setSizeFilters: (size: { min: number; max: number } | null) => void;
  setColorFilters: (colors: string[]) => void;
  setPatternFilters: (patterns: string[]) => void;
  setFinishFilters: (finishes: TileFinish[]) => void;
  setPriceRangeFilter: (range: { min: number; max: number } | null) => void;
  clearFilters: () => void;

  // Derived data
  getFeaturedProducts: () => Product[];
  getNewArrivals: () => Product[];
  applyFilters: () => void;
  updateFilteredProducts: () => void;
}

export const useProductStore = create<ProductStoreState>((set, get) => ({
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,

  // Filter states
  tileTypeFilter: null,
  roomTypeFilter: null,
  sizeFilters: null,
  colorFilters: [],
  patternFilters: [],
  finishFilters: [],
  priceRangeFilter: null,

  // Actions
  setProducts: (products) => {
    set({ products });
    // Update filtered products after setting products
    setTimeout(() => get().updateFilteredProducts(), 0);
  },
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Filter actions with debounced filter application
  setTileTypeFilter: (type) => {
    set({ tileTypeFilter: type });
    setTimeout(() => get().applyFilters(), 0);
  },
  setRoomTypeFilter: (type) => {
    set({ roomTypeFilter: type });
    setTimeout(() => get().applyFilters(), 0);
  },
  setSizeFilters: (size) => {
    set({ sizeFilters: size });
    setTimeout(() => get().applyFilters(), 0);
  },
  setColorFilters: (colors) => {
    set({ colorFilters: colors });
    setTimeout(() => get().applyFilters(), 0);
  },
  setPatternFilters: (patterns) => {
    set({ patternFilters: patterns });
    setTimeout(() => get().applyFilters(), 0);
  },
  setFinishFilters: (finishes) => {
    set({ finishFilters: finishes });
    setTimeout(() => get().applyFilters(), 0);
  },
  setPriceRangeFilter: (range) => {
    set({ priceRangeFilter: range });
    setTimeout(() => get().applyFilters(), 0);
  },

  clearFilters: () => {
    set({
      tileTypeFilter: null,
      roomTypeFilter: null,
      sizeFilters: null,
      colorFilters: [],
      patternFilters: [],
      finishFilters: [],
      priceRangeFilter: null,
    });
    // Update filtered products on next tick
    setTimeout(() => get().updateFilteredProducts(), 0);
  },

  // Derived data
  getFeaturedProducts: () => {
    return get().products.filter((product) => product.featured);
  },

  getNewArrivals: () => {
    return get().products.filter((product) => product.new);
  },

  // Helper to update filtered products with current products
  updateFilteredProducts: () => {
    set({ filteredProducts: get().products });
  },

  applyFilters: () => {
    const {
      products,
      tileTypeFilter,
      roomTypeFilter,
      sizeFilters,
      colorFilters,
      patternFilters,
      finishFilters,
      priceRangeFilter,
    } = get();

    let filtered = [...products];

    // Apply tile type filter
    if (tileTypeFilter) {
      filtered = filtered.filter(
        (product) => product.tileType === tileTypeFilter
      );
    }

    // Apply room type filter
    if (roomTypeFilter) {
      filtered = filtered.filter((product) =>
        product.roomTypes.includes(roomTypeFilter)
      );
    }

    // Apply size filters
    if (sizeFilters) {
      filtered = filtered.filter((product) =>
        product.sizes.some(
          (size) =>
            size.width >= (sizeFilters.min || 0) &&
            size.width <= (sizeFilters.max || Infinity)
        )
      );
    }

    // Apply color filters
    if (colorFilters.length > 0) {
      filtered = filtered.filter((product) =>
        colorFilters.some((color) => product.colors.includes(color))
      );
    }

    // Apply pattern filters
    if (patternFilters.length > 0) {
      filtered = filtered.filter((product) =>
        patternFilters.some((pattern) => product.patterns.includes(pattern))
      );
    }

    // Apply finish filters
    if (finishFilters.length > 0) {
      filtered = filtered.filter((product) =>
        finishFilters.some((finish) => product.finishes.includes(finish))
      );
    }

    // Apply price range filter
    if (priceRangeFilter && (priceRangeFilter.min || priceRangeFilter.max)) {
      filtered = filtered.filter(
        (product) =>
          product.priceRange &&
          product.priceRange.min >= (priceRangeFilter.min || 0) &&
          product.priceRange.max <= (priceRangeFilter.max || Infinity)
      );
    }

    set({ filteredProducts: filtered });
  },
}));
