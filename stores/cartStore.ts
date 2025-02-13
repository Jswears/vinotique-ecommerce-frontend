import { api } from "@/app/lib/api";
import { getGuestUserId } from "@/app/lib/auth";
import { create } from "zustand";

//
// Define Types
//

// Type for the cart item returned from GET /cart
export interface CartItem {
  addedAt: string;
  wineId: string;
  quantity: number;
  productName: string;
  price: number;
  imageUrl: string;
}

// Type for the cart item sent in POST /cart
export interface CartPostItem {
  wineId: string;
  quantity: number;
  action: "add" | "remove" | "clear";
}

// Type for the GET /cart response
interface CartResponse {
  cartItems: CartItem[];
  totalPrice: number;
}

// Define the store state and actions
interface CartStoreState {
  cartItems: CartItem[];
  totalPrice: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (
    userId: string,
    wineId: string,
    quantity: number
  ) => Promise<void>;
  removeFromCart: (
    userId: string,
    wineId: string,
    quantity: number
  ) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
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
    const userId = getGuestUserId();
    try {
      // Get userId
      // Use the custom API library
      const data = (await api.get(`/cart/${userId}`)) as CartResponse;
      console.log("cositas", data);
      set({
        cartItems: data.cartItems,
        totalPrice: data.totalPrice,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      if (errMsg.toLowerCase().includes("no cart found")) {
        // Clear cart if error indicates the cart does not exist.
        set({
          cartItems: [],
          totalPrice: 0,
          loading: false,
          error: null,
        });
      } else {
        set({ error: errMsg, loading: false });
        console.error("Error fetching cart:", error);
      }
    }
  },

  // Add an item to the cart and refresh the cart state
  addToCart: async (userId: string, wineId: string, quantity: number) => {
    set({ loading: true });
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
      console.log("payload", payload);
      // Use the custom API library
      const response = await api.post(`/cart/${userId}`, payload);
      console.log("response", response);
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
  removeFromCart: async (userId: string, wineId: string, quantity: number) => {
    set({ loading: true });
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
      console.log("payload", payload);
      // Use the custom API library
      const response = await api.post(`/cart/${userId}`, payload);
      console.log("response", response);
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
  clearCart: async (userId: string) => {
    set({ loading: true });
    try {
      const payload = {
        cartItems: [
          {
            action: "clear",
          } as CartPostItem,
        ],
      };
      console.log("payload", payload);
      // Use the custom API library
      const response = await api.post(`/cart/${userId}`, payload);
      console.log("response", response);
      // Refresh the cart after clearing the cart.
      await get().fetchCart();
    } catch (error: any) {
      let errorMessage = "Unknown error";
      if (error?.message) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
      console.error("Error clearing cart:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Helper function to calculate the total number of items in the cart
  getTotalQuantity: () =>
    get().cartItems.reduce((sum, item) => sum + item.quantity, 0),
  getTotalPrice: () =>
    get().cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
export default useCartStore;
