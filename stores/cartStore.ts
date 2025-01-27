import { api } from "@/app/lib/api";
import { getGuestUserId } from "@/app/lib/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the types

type OrderItem = {
  wineId: string;
  quantity: number;
  userId: string;
  action: "add" | "remove";
};

type CartState = {
  cart: OrderItem[];
  cartQuantity: number;
  loading: boolean;
  error: string | null;
  updateCartState: (items: any) => Promise<void>;
  addToCart: (wine: OrderItem) => Promise<void>;
  removeFromCart: (cartItem: OrderItem) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      cartQuantity: 0,
      loading: false,
      error: null,
      updateCartState: async (items: any) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post("/cart", { items });
          if (response && response.messages) {
            const data = (await api.get(`/cart/${getGuestUserId()}`)) || [];
            set({ cart: data, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      addToCart: async (wine: OrderItem) => {
        await get().updateCartState([
          { ...wine, userId: getGuestUserId(), action: "add" },
        ]);
      },
      removeFromCart: (cartItem: OrderItem) => {
        set((state) => {
          return {
            cart: state.cart.filter((item) => item.wineId !== cartItem.wineId),
          };
        });
      },
    }),
    {
      name: "wine-cart-storage",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
