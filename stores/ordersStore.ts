import { api } from "@/app/lib/api";
import { Order, OrdersResponse } from "@/app/types";
import { create } from "zustand";

// Define the store state and actions
interface OrdersStoreState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  totalOrdersCount: number;
  fetchOrders: () => Promise<void>;
}

export const useOrdersStore = create<OrdersStoreState>((set, get) => ({
  // Initial state
  orders: [],
  loading: false,
  totalOrdersCount: 0,
  error: null,

  // Fetch the orders from the backend
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const response = (await api.get("/orders")) as OrdersResponse;
      set({ orders: response.orders, totalOrdersCount: response.totalCount });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));
