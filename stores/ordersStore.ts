import { create } from "zustand";
import { useAuthStore } from "./authStore";
import { Order, OrdersResponse } from "@/types";
import { api } from "@/lib/api";

interface OrdersStoreState {
  orders: Order[];
  loadingOrdersState: "idle" | "loading" | "error" | "success";
  error: string | null;
  totalOrdersCount: number;
  fetchOrders: () => Promise<void>;
}

export const useOrdersStore = create<OrdersStoreState>((set, get) => ({
  orders: [],
  loadingOrdersState: "idle",
  totalOrdersCount: 0,
  error: null,

  fetchOrders: async () => {
    set({ loadingOrdersState: "loading", error: null, orders: [] });

    try {
      // Refresh token if expired
      await useAuthStore.getState().refreshToken();

      const user = useAuthStore.getState().user;
      if (!user || !user.accessToken) {
        set({ loadingOrdersState: "error", error: "User not authenticated" });
        return;
      }

      const response = (await api.get("/orders")) as OrdersResponse;

      if (response) {
        set({
          orders: response.orders,
          totalOrdersCount: response.totalCount,
          loadingOrdersState: "success",
        });
      } else {
        set({ loadingOrdersState: "error", error: "Failed to fetch orders" });
      }
    } catch (error) {
      set({ error: (error as Error).message, loadingOrdersState: "error" });
    }
  },
}));
