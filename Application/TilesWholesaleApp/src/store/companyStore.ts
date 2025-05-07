import { create } from "zustand";
import {
  CompanyInfo,
  StoreLocation,
  Testimonial,
  CompletedProject,
} from "../types";

interface CompanyStoreState {
  companyInfo: CompanyInfo | null;
  testimonials: Testimonial[];
  completedProjects: CompletedProject[];
  loading: boolean;
  error: string | null;

  // Actions
  setCompanyInfo: (info: CompanyInfo) => void;
  setTestimonials: (testimonials: Testimonial[]) => void;
  setCompletedProjects: (projects: CompletedProject[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Derived data
  getPrimaryLocation: () => StoreLocation | undefined;
  getHighestRatedTestimonials: (count: number) => Testimonial[];
  getLatestProjects: (count: number) => CompletedProject[];
}

export const useCompanyStore = create<CompanyStoreState>((set, get) => ({
  companyInfo: null,
  testimonials: [],
  completedProjects: [],
  loading: false,
  error: null,

  // Actions
  setCompanyInfo: (info) => set({ companyInfo: info }),
  setTestimonials: (testimonials) => set({ testimonials }),
  setCompletedProjects: (projects) => set({ completedProjects: projects }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Derived data
  getPrimaryLocation: () => {
    const { companyInfo } = get();
    if (!companyInfo) return undefined;
    return companyInfo.locations[0];
  },

  getHighestRatedTestimonials: (count) => {
    const { testimonials } = get();
    return [...testimonials]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, count);
  },

  getLatestProjects: (count) => {
    const { completedProjects } = get();
    return [...completedProjects]
      .sort(
        (a, b) =>
          new Date(b.completedDate).getTime() -
          new Date(a.completedDate).getTime()
      )
      .slice(0, count);
  },
}));
