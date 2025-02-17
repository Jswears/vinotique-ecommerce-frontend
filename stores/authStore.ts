import { create } from "zustand";
import useCartStore from "@/stores/cartStore";
import { fetchAuthSession } from "aws-amplify/auth";

interface AuthStore {
  isAuthenticated: boolean;
  isAuthenticatedAsAdmin: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsAuthenticatedAsAdmin: (isAuthenticatedAsAdmin: boolean) => void;
  userId: string;
  getUserId: () => string;
  setUserId: (userId: string) => void;
  logout: () => void; // New logout action
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  isAuthenticatedAsAdmin: false,
  userId: "",
  loading: true,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsAuthenticatedAsAdmin: (isAuthenticatedAsAdmin) =>
    set({ isAuthenticatedAsAdmin }),
  setUserId: (userId) => set({ userId }),
  setLoading: (loading) => set({ loading }),

  // Helper function to get the userId
  getUserId: (): string => get().userId || "",

  logout: async () => {
    set({ isAuthenticated: false, userId: "", loading: true });

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
