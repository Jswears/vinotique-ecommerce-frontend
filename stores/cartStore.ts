import { api } from "@/lib/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  addToCart: (cartItem: CartItem, quantity: number) => Promise<void>;
  removeFromCart: (wineId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  clearCartLocally: () => void;
  transferGuestCart: () => Promise<void>;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
}

const useCartStore = create<CartStoreState>()(
  // Persisting the cart store ensures that for guest users the cart items
  // are stored in local storage.
  persist(
    (set, get) => ({
      cartItems: [],
      totalPrice: 0,
      itemsCount: 0,
      loading: false,
      error: null,
      cartFetched: false,

      // Fetch cart items from API if user is authenticated;
      // for guests, you may rely solely on the local state.
      fetchCart: async () => {
        const { user, guestUserId, isAuthenticated } = useAuthStore.getState();
        // If guest, you can simply return as items are stored locally.
        if (!isAuthenticated) return;

        const userId = user?.userId || guestUserId;
        if (!userId || get().cartFetched) {
          return; // Prevent redundant fetch calls
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

      addToCart: async (wine: CartItem, quantity: number) => {
        const { user, guestUserId, isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
          // Guest user: update cart locally (which is persisted)
          set((state) => {
            const existingItem = state.cartItems.find(
              (item) => item.wineId === wine.wineId
            );
            let updatedCartItems;
            if (existingItem) {
              updatedCartItems = state.cartItems.map((item) =>
                item.wineId === wine.wineId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              );
            } else {
              updatedCartItems = [
                ...state.cartItems,
                {
                  wineId: wine.wineId,
                  quantity,
                  addedAt: new Date(),
                  productName: wine.productName,
                  price: wine.price,
                  imageUrl: wine.imageUrl,
                  isInStock: wine.isInStock,
                  stockQuantity: wine.stockQuantity,
                },
              ];
            }
            return {
              ...state,
              cartItems: updatedCartItems,
              totalPrice: updatedCartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ),
              itemsCount: updatedCartItems.reduce(
                (sum, item) => sum + item.quantity,
                0
              ),
            };
          });
          return;
        }

        // Authenticated user: proceed with API call.
        const userId = user?.userId || guestUserId;
        if (!userId) return;
        set({ loading: true });
        try {
          await api.post(`/cart/${userId}`, {
            cartItems: [
              { wineId: wine.wineId, quantity, action: "add" } as CartPostItem,
            ],
          });

          set((state) => ({
            ...state,
            cartFetched: false, // Force refresh after update
          }));

          await get().fetchCart();
        } catch (error: any) {
          console.error("Error adding to cart:", error);
          set({ error: error.message || "Failed to add item" });
        } finally {
          set({ loading: false });
        }
      },

      // Remove from cart remains the same.
      removeFromCart: async (wineId: string, quantity: number) => {
        const { user, guestUserId, isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
          // For guest users, update the local state.
          set((state) => {
            const updatedCartItems = state.cartItems
              .map((item) =>
                item.wineId === wineId
                  ? { ...item, quantity: item.quantity - quantity }
                  : item
              )
              .filter((item) => item.quantity > 0);
            return {
              ...state,
              cartItems: updatedCartItems,
              itemsCount: updatedCartItems.reduce(
                (sum, item) => sum + item.quantity,
                0
              ),
            };
          });
          return;
        }

        const userId = user?.userId || guestUserId;
        if (!userId) return;

        set({ loading: true });
        try {
          await api.post(`/cart/${userId}`, {
            cartItems: [{ wineId, quantity, action: "remove" } as CartPostItem],
          });

          set((state) => ({
            ...state,
            cartFetched: false, // Force refresh after update
          }));

          await get().fetchCart();
        } catch (error: any) {
          console.error("Error removing from cart:", error);
          set({ error: error.message || "Failed to remove item" });
        } finally {
          set({ loading: false });
        }
      },

      // Clear the server-side cart.
      clearCart: async () => {
        const { user, guestUserId, isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
          // For guest users, simply clear the local cart.
          set({
            cartItems: [],
            totalPrice: 0,
            itemsCount: 0,
            error: null,
          });
          return;
        }

        const userId = user?.userId || guestUserId;
        if (!userId) return;
        set({ loading: true });
        try {
          await api.post(`/cart/${userId}`, {
            cartItems: [{ action: "clear" }],
          });
          set({
            cartItems: [],
            totalPrice: 0,
            itemsCount: 0,
            error: null,
            cartFetched: false,
          });
        } catch (error: any) {
          console.error("Error clearing cart:", error);
          set({ error: error?.message || "Failed to clear cart" });
        } finally {
          set({ loading: false });
        }
      },

      // Clear cart locally (used for local state resets)
      clearCartLocally: () => {
        set({
          cartItems: [],
          totalPrice: 0,
          itemsCount: 0,
          error: null,
        });
      },

      transferGuestCart: async () => {
        const { guestUserId, user } = useAuthStore.getState();
        if (!guestUserId || !user) return;

        set({ loading: true });

        try {
          const guestCartItems = get().cartItems; // Local guest cart items
          if (!guestCartItems || guestCartItems.length === 0) return;

          // Batch API request to transfer guest cart to authenticated user's cart.
          await api.post(`/cart/${user.userId}`, {
            cartItems: guestCartItems.map((item) => ({
              wineId: item.wineId,
              quantity: item.quantity,
              action: "add",
            })),
          });

          // Clear local guest cart after transfer.
          set({
            cartItems: [],
            totalPrice: 0,
            itemsCount: 0,
            cartFetched: false,
          });

          await get().fetchCart();
        } catch (error: any) {
          console.error("Error transferring guest cart:", error);
          set({ error: error?.message || "Failed to transfer guest cart" });
        } finally {
          set({ loading: false });
        }
      },

      // Get total quantity of items in the cart.
      getTotalQuantity: () =>
        get().cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),

      // Get total price of items in the cart.
      getTotalPrice: () => get().totalPrice,
    }),
    {
      name: "cart-store", // Name for localStorage key
      // Optionally, you can whitelist only certain state values:
      // whitelist: ['cartItems', 'itemsCount', 'totalPrice']
    }
  )
);

export default useCartStore;
