import { api } from "@/app/lib/api";
import { create } from "zustand";
import { useAuthStore } from "@/stores/authStore";
import { CartItem, CartPostItem, CartResponse } from "@/app/types";

// Define the store state and actions
interface CartStoreState {
  cartItems: CartItem[];
  totalPrice: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (wineId: string, quantity: number) => Promise<void>;
  removeFromCart: (wineId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearCartLocally: () => void;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
  // New action to transfer cart from guest to authenticated user
  transferCart: (guestUserId: string, authUserId: string) => Promise<void>;
}

const useCartStore = create<CartStoreState>((set, get) => ({
  // Initial state
  cartItems: [],
  totalPrice: 0,
  loading: false,
  error: null,

  // Fetch the cart from the backend
  fetchCart: async () => {
    set({ loading: true });
    const userId = useAuthStore.getState().getUserId();
    if (!userId) {
      set({ loading: false });
      return;
    }
    try {
      // Use the custom API library
      const data = (await api.get(`/cart/${userId}`)) as CartResponse;
      set({
        cartItems: data.cartItems,
        totalPrice: data.totalPrice,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      if (errMsg.toLowerCase().includes("no cart found")) {
        console.warn("Cart not found, keeping existing cart state.");
        set({ loading: false, error: null });
        return;
      }
      set({ loading: false, error: errMsg });
    }
  },

  // Add an item to the cart and refresh the cart state
  addToCart: async (wineId: string, quantity: number) => {
    set({ loading: true });
    const userId = useAuthStore.getState().getUserId();
    try {
      const payload = {
        cartItems: [
          {
            wineId,
            quantity,
            action: "add",
          } as CartPostItem,
        ],
      };
      // Use the custom API library
      const response = await api.post(`/cart/${userId}`, payload);
      // Refresh the cart after adding an item.
      await get().fetchCart();
    } catch (error: any) {
      let errorMessage = "Unknown error";
      if (error?.message) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
      console.error("Error adding to cart:", error);
    } finally {
      set({ loading: false });
    }
  },
  // Remove an item to the cart and refresh the cart state
  removeFromCart: async (wineId: string, quantity: number) => {
    set({ loading: true });
    const userId = useAuthStore.getState().getUserId();
    try {
      const payload = {
        cartItems: [
          {
            wineId,
            quantity,
            action: "remove",
          } as CartPostItem,
        ],
      };
      // Use the custom API library
      const response = await api.post(`/cart/${userId}`, payload);
      // Refresh the cart after removing an item.
      await get().fetchCart();
    } catch (error: any) {
      let errorMessage = "Unknown error";
      if (error?.message) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
      console.error("Error removing from cart:", error);
    } finally {
      set({ loading: false });
    }
  },
  // Clear cart and refresh the cart state
  clearCart: async () => {
    set({ loading: true });
    const userId = useAuthStore.getState().getUserId();
    try {
      await api.post(`/cart/${userId}`, {
        cartItems: [{ action: "clear" }],
      });
      set({ cartItems: [], totalPrice: 0, error: null }); // ✅ Reset cart state
      get().clearCartLocally(); // Clear local cart state
    } catch (error: any) {
      set({ error: error?.message || "Unknown error" });
    } finally {
      set({ loading: false });
    }
  },

  clearCartLocally: () => {
    set({ cartItems: [], totalPrice: 0, error: null });
  },

  // New action to transfer cart from guest to authenticated user
  transferCart: async (guestUserId: string, authUserId: string) => {
    set({ loading: true });
    try {
      const guestItems = get().cartItems;
      // Transfer each guest cart item to authenticated user's cart
      for (const item of guestItems) {
        const payload = {
          cartItems: [
            {
              wineId: item.wineId,
              quantity: item.quantity,
              action: "add",
            },
          ],
        };
        await api.post(`/cart/${authUserId}`, payload);
      }
      // Clear guest cart
      await api.post(`/cart/${guestUserId}`, {
        cartItems: [{ action: "clear" }],
      });
      // Optionally refresh authenticated user's cart
      await get().fetchCart();
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      set({ error: errMsg });
      console.error("Error transferring cart:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Helper function to calculate the total number of items in the cart
  getTotalQuantity: () =>
    get().cartItems.reduce((sum, item) => sum + item.quantity, 0),
  getTotalPrice: () => get().totalPrice,
}));
export default useCartStore;
