import { api } from "@/lib/api";
import { create } from "zustand";
import { useAuthStore } from "@/stores/authStore";
import { CartItem, CartPostItem, CartResponse } from "@/types";

interface CartStoreState {
  cartItems: CartItem[];
  totalPrice: number;
  itemsCount: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (wineId: string, quantity: number) => Promise<void>;
  removeFromCart: (wineId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearCartLocally: () => void;
  transferGuestCart: () => Promise<void>;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
}

const useCartStore = create<CartStoreState>((set, get) => ({
  cartItems: [],
  totalPrice: 0,
  itemsCount: 0,
  loading: false,
  error: null,

  // Fetch cart items based on the current user/guest ID.
  fetchCart: async () => {
    set({ loading: true });
    const { user, guestUserId } = useAuthStore.getState();
    const userId = user?.userId || guestUserId;
    if (!userId) {
      set({ loading: false, cartItems: [], totalPrice: 0, error: null });
      return;
    }
    try {
      const response = (await api.get(
        `/cart/${userId}`
      )) as CartResponse | null;
      if (response) {
        const updatedItemsCount = response.cartItems.reduce(
          (count, item) => count + (item.quantity || 0),
          0
        );
        set({
          cartItems: response.cartItems,
          totalPrice: response.totalPrice,
          itemsCount: updatedItemsCount,
          error: null,
        });
      } else {
        set({ cartItems: [], totalPrice: 0, itemsCount: 0, error: null });
      }
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      set({
        loading: false,
        error: error?.message || String(error),
        cartItems: [],
        totalPrice: 0,
        itemsCount: 0,
      });
    } finally {
      set({ loading: false });
    }
  },

  // Add an item to the cart.
  addToCart: async (wineId: string, quantity: number) => {
    set({ loading: true });
    const { user, guestUserId } = useAuthStore.getState();
    const userId = user?.userId || guestUserId;
    try {
      await api.post(`/cart/${userId}`, {
        cartItems: [{ wineId, quantity, action: "add" } as CartPostItem],
      });
      await get().fetchCart();
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      set({ error: error.message || "Unknown error" });
    } finally {
      set({ loading: false });
    }
  },

  // Remove an item from the cart.
  removeFromCart: async (wineId: string, quantity: number) => {
    set({ loading: true });
    const { user, guestUserId } = useAuthStore.getState();
    const userId = user?.userId || guestUserId;
    try {
      await api.post(`/cart/${userId}`, {
        cartItems: [{ wineId, quantity, action: "remove" } as CartPostItem],
      });
      await get().fetchCart();
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      set({ error: error.message || "Unknown error" });
    } finally {
      set({ loading: false });
    }
  },

  // Clear the cart on the server.
  clearCart: async () => {
    set({ loading: true });
    const { user, guestUserId } = useAuthStore.getState();
    const userId = user?.userId || guestUserId;
    if (!userId) {
      console.warn("No user or guest session found. Cannot clear cart.");
      set({ loading: false });
      return;
    }
    try {
      await api.post(`/cart/${userId}`, { cartItems: [{ action: "clear" }] });
      set({ cartItems: [], totalPrice: 0, error: null });
      get().clearCartLocally();
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      set({ error: error?.message || "Unknown error" });
    } finally {
      set({ loading: false });
    }
  },

  // Clear the cart locally without calling the API.
  clearCartLocally: () => {
    set({ cartItems: [], totalPrice: 0, error: null });
  },

  // Transfer guest cart items to the authenticated user's cart.
  transferGuestCart: async () => {
    set({ loading: true });
    const { guestUserId, user } = useAuthStore.getState();
    if (!guestUserId || !user) {
      console.warn("No guest or authenticated user available for transfer.");
      set({ loading: false });
      return;
    }
    try {
      const guestCartResponse = (await api.get(
        `/cart/${guestUserId}`
      )) as CartResponse | null;
      if (guestCartResponse) {
        // Transfer each guest cart item to the authenticated cart.
        for (const item of guestCartResponse.cartItems) {
          await api.post(`/cart/${user.userId}`, {
            cartItems: [
              { wineId: item.wineId, quantity: item.quantity, action: "add" },
            ],
          });
        }
        // Optionally clear the guest cart on the server.
        await api.post(`/cart/${guestUserId}`, {
          cartItems: [{ action: "clear" }],
        });
        // Clear the local cart and refresh.
        get().clearCartLocally();
        await get().fetchCart();
      }
    } catch (error: any) {
      console.error("Error transferring guest cart:", error);
      set({ error: error?.message || String(error) });
    } finally {
      set({ loading: false });
    }
  },

  getTotalQuantity: () =>
    get().cartItems.reduce((sum, item) => sum + item.quantity, 0),
  getTotalPrice: () => get().totalPrice,
}));

export default useCartStore;
