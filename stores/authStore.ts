import { create } from "zustand";
import useCartStore from "@/stores/cartStore";
import { fetchAuthSession } from "aws-amplify/auth";

interface AuthStore {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  userId: string;
  getUserId: () => string;
  setUserId: (userId: string) => void;
  logout: () => void; // New logout action
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  userId: "",
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setUserId: (userId) => set({ userId }),

  // Helper function to get the userId
  getUserId: (): string => get().userId || "",

  logout: async () => {
    set({ isAuthenticated: false, userId: "" });

    //clear cart locally
    useCartStore.getState().clearCartLocally();
    // Get new guest identityId after logout
    const session = await fetchAuthSession();
    const identityId = session?.identityId;

    if (typeof identityId === "string") {
      set({ userId: identityId }); // ✅ Set guest user identity
      await useCartStore.getState().fetchCart(); // ✅ Refresh cart for guest
    }
  },
}));
