import { api } from "@/app/lib/api";
import { Wine, WinesResponse } from "@/app/types";
import { create } from "zustand";

// Define the store state and actions
interface WinesStoreState {
  wines: Wine[];
  loadingState: "idle" | "loading" | "error" | "success";
  error: string | null;
  totalWinesCount: number;
  fetchWines: () => Promise<void>;
  deleteWine: (wineId: string) => Promise<void>;
}

export const useWinesStore = create<WinesStoreState>((set, get) => ({
  // Initial state
  wines: [],
  loadingState: "idle", // Possible values: 'idle', 'loading', 'error', 'success'
  totalWinesCount: 0,
  error: null,

  // Fetch the wines from the backend
  fetchWines: async () => {
    set({ loadingState: "loading", error: null, wines: [] }); // Clear wines and set loading state
    try {
      const response = (await api.get("/wines")) as WinesResponse;
      set({
        wines: response.wines,
        totalWinesCount: response.totalCount,
        loadingState: "success",
      }); // Set wines and success state
    } catch (error) {
      set({ error: (error as Error).message, loadingState: "error" }); // Set error state
    }
  },
  deleteWine: async (wineId: string) => {
    set({ loadingState: "loading", error: null });
    try {
      await api.delete(`/wines/${wineId}`);
      const wines = get().wines.filter((wine) => wine.wineId !== wineId);
      set({ wines });
      // Optionally refetch wines to ensure data consistency
      await get().fetchWines();
    } catch (error) {
      set({ error: (error as Error).message, loadingState: "error" });
    } finally {
      set({ loadingState: "idle" });
    }
  },
}));
