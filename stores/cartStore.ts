import { api } from "@/app/lib/api";
import { getGuestUserId } from "@/app/lib/auth";
import { CartItem } from "@/app/types";
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
  cart: CartItem[];
  cartQuantity: number;
  updateCartQuantity: (quantity: number) => void;
  loading: boolean;
  error: string | null;
  updateCartState: (items: any) => Promise<void>;
  addToCart: (wine: OrderItem) => Promise<void>;
  removeFromCart: (cartItem: OrderItem) => Promise<void>;
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
            set({
              cartQuantity: data.reduce(
                (total: number, item: OrderItem) => total + item.quantity,
                0
              ),
            });
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      updateCartQuantity: (quantity: number) => {
        set({ cartQuantity: quantity });
      },
      addToCart: async (wine: OrderItem) => {
        await get().updateCartState([
          { ...wine, userId: getGuestUserId(), action: "add" },
        ]);
      },
      removeFromCart: async (wine: OrderItem) => {
        await get().updateCartState([
          { ...wine, userId: getGuestUserId(), action: "remove" },
        ]);
      },
    }),
    {
      name: "wine-cart-storage",
      partialize: (state) => ({
        cart: state.cart,
        cartQuantity: state.cart.reduce(
          (total, item) => total + (item.quantity ?? 0),
          0
        ),
      }),
    }
  )
);
