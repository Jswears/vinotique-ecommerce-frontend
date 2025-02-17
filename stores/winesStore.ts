import { api } from "@/app/lib/api";
import { Wine, WinesResponse } from "@/app/types";
import { create } from "zustand";

// Define the store state and actions
interface WinesStoreState {
  wines: Wine[];
  loading: boolean;
  error: string | null;
  totalWinesCount: number;
  fetchWines: () => Promise<void>;
  deleteWine: (wineId: string) => Promise<void>;
}

export const useWinesStore = create<WinesStoreState>((set, get) => ({
  // Initial state
  wines: [],
  loading: false,
  totalWinesCount: 0,
  error: null,

  // Fetch the wines from the backend
  fetchWines: async () => {
    set({ loading: true });
    try {
      const response = (await api.get("/wines")) as WinesResponse;
      set({ wines: response.wines, totalWinesCount: response.totalCount });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  deleteWine: async (wineId: string) => {
    set({ loading: true });
    try {
      await api.delete(`/wines/${wineId}`);
      const wines = get().wines.filter((wine) => wine.wineId !== wineId);
      set({ wines });
      // Optionally refetch wines to ensure data consistency
      await get().fetchWines();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));
