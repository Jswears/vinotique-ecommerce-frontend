import { api } from "@/app/lib/api";
import { Wine, WinesResponse } from "@/app/types";
import { create } from "zustand";

// Define the store state and actions
interface WinesStoreState {
  wines: Wine[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  fetchWines: () => Promise<void>;
}

export const useWinesStore = create<WinesStoreState>((set, get) => ({
  // Initial state
  wines: [],
  loading: false,
  totalCount: 0,
  error: null,

  // Fetch the wines from the backend
  fetchWines: async () => {
    set({ loading: true });
    try {
      const response = (await api.get("/wines")) as WinesResponse;
      set({ wines: response.wines, totalCount: response.totalCount });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));
