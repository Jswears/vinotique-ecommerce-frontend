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
  cartFetched: boolean;
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
  cartFetched: false, // ✅ NEW FLAG to prevent redundant fetch calls

  // ✅ Fetch cart items only once if not fetched
  fetchCart: async () => {
    const { user, guestUserId } = useAuthStore.getState();
    const userId = user?.userId || guestUserId;

    if (!userId || get().cartFetched) {
      return; // ✅ Prevent redundant fetch calls if already fetched
    }

    set({ loading: true });

    try {
      const response = (await api.get(
        `/cart/${userId}`
      )) as CartResponse | null;

      if (!response || response.cartItems.length === 0) {
        set({
          cartItems: [],
          totalPrice: 0,
          itemsCount: 0,
          error: null,
          cartFetched: true,
        });
        return;
      }

      set((state) => ({
        ...state,
        cartItems: response.cartItems,
        totalPrice: response.totalPrice,
        itemsCount: response.cartItems.reduce(
          (count, item) => count + (item.quantity || 0),
          0
        ),
        cartFetched: true,
        error: null,
      }));
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      set({
        error: error?.message || "Failed to fetch cart",
        cartFetched: true,
      });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Add an item to the cart
  addToCart: async (wineId: string, quantity: number) => {
    const { user, guestUserId } = useAuthStore.getState();
    const userId = user?.userId || guestUserId;
    if (!userId) return;

    set({ loading: true });

    try {
      await api.post(`/cart/${userId}`, {
        cartItems: [{ wineId, quantity, action: "add" } as CartPostItem],
      });

      set((state) => ({
        ...state,
        cartFetched: false, // ✅ Force refresh after update
      }));

      await get().fetchCart();
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      set({ error: error.message || "Failed to add item" });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Remove an item from the cart
  removeFromCart: async (wineId: string, quantity: number) => {
    const { user, guestUserId } = useAuthStore.getState();
    const userId = user?.userId || guestUserId;
    if (!userId) return;

    set({ loading: true });

    try {
      await api.post(`/cart/${userId}`, {
        cartItems: [{ wineId, quantity, action: "remove" } as CartPostItem],
      });

      set((state) => ({
        ...state,
        cartFetched: false, // ✅ Force refresh after update
      }));

      await get().fetchCart();
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      set({ error: error.message || "Failed to remove item" });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Clear cart on the server
  clearCart: async () => {
    const { user, guestUserId } = useAuthStore.getState();
    const userId = user?.userId || guestUserId;
    if (!userId) return;

    set({ loading: true });

    try {
      await api.post(`/cart/${userId}`, { cartItems: [{ action: "clear" }] });

      set({
        cartItems: [],
        totalPrice: 0,
        itemsCount: 0,
        error: null,
        cartFetched: false, // ✅ Allow refetch after clearing
      });
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      set({ error: error?.message || "Failed to clear cart" });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Clear cart locally
  clearCartLocally: () => {
    set({
      cartItems: [],
      totalPrice: 0,
      itemsCount: 0,
      error: null,
    });
  },

  // ✅ Transfer guest cart items to authenticated user
  transferGuestCart: async () => {
    const { guestUserId, user } = useAuthStore.getState();
    if (!guestUserId || !user) return;

    set({ loading: true });

    try {
      const guestCartResponse = (await api.get(
        `/cart/${guestUserId}`
      )) as CartResponse | null;
      if (!guestCartResponse || guestCartResponse.cartItems.length === 0)
        return;

      // ✅ Batch API request to reduce calls
      await api.post(`/cart/${user.userId}`, {
        cartItems: guestCartResponse.cartItems.map((item) => ({
          wineId: item.wineId,
          quantity: item.quantity,
          action: "add",
        })),
      });

      // ✅ Clear guest cart after transfer
      await api.post(`/cart/${guestUserId}`, {
        cartItems: [{ action: "clear" }],
      });

      set({
        cartFetched: false, // ✅ Force refetch
      });

      await get().fetchCart();
    } catch (error: any) {
      console.error("Error transferring guest cart:", error);
      set({ error: error?.message || "Failed to transfer guest cart" });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Get total quantity of items in the cart
  getTotalQuantity: () =>
    get().cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),

  // ✅ Get total price of items in the cart
  getTotalPrice: () => get().totalPrice,
}));

export default useCartStore;
