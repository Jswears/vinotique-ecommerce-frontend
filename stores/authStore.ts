import { create } from "zustand";
import {
  persist,
  PersistStorage,
  StateStorage,
  StorageValue,
} from "zustand/middleware";
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";

interface AuthUser {
  username: string;
  userId: string;
  email: string;
  isAdmin: boolean;
  accessToken: string | undefined;
  expiration: number;
}

interface AuthStore {
  user?: AuthUser;
  guestUserId?: string;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  clearGuestUser: () => void;
}

// Create a safe storage fallback. This uses localStorage if available,
// otherwise it provides no-op functions.
const safeStorage: PersistStorage<AuthStore> = {
  getItem: (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  setItem: (key: string, value: StorageValue<AuthStore>) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: undefined,
      guestUserId: undefined,
      isAuthenticated: false,

      // Check current session and update store accordingly.
      fetchUser: async () => {
        try {
          const session = await fetchAuthSession();
          if (!session.tokens) {
            // No tokens means guest session – store the identityId.
            console.log("Guest user detected");
            set({
              guestUserId: session.identityId,
              user: undefined,
              isAuthenticated: false,
            });
            return;
          }
          // Authenticated session – load user details.
          const accessToken = session.tokens.accessToken;
          const idToken = session.tokens.idToken;
          const userAttributes = await fetchUserAttributes();
          const currentUser = await getCurrentUser();
          const user: AuthUser = {
            username: currentUser.username,
            email: userAttributes.email || "",
            userId: userAttributes.sub || "",
            isAdmin:
              (Array.isArray(accessToken.payload["cognito:groups"]) &&
                accessToken.payload["cognito:groups"].includes("ADMINS")) ||
              false,
            accessToken: idToken?.toString(),
            expiration: accessToken.payload.exp
              ? accessToken.payload.exp * 1000
              : 0,
          };
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      },

      // Refresh token if it has expired.
      refreshToken: async () => {
        const { user } = get();
        if (!user) return;
        if (user.expiration > Date.now()) return;
        console.log("Refreshing token...");
        await get().fetchUser();
      },

      // Sign out and reinitialize a guest session.
      logout: async () => {
        try {
          await signOut();
          set({
            user: undefined,
            isAuthenticated: false,
            guestUserId: undefined,
          });
          // Initialize guest session after logout.
          await get().fetchUser();
        } catch (error) {
          console.error("Error logging out:", error);
        }
      },

      // Call this when the app loads.
      initAuth: async () => {
        await get().fetchUser();
      },

      // Optionally clear guestUserId if no longer needed.
      clearGuestUser: () => {
        set({ guestUserId: undefined });
      },
    }),
    { name: "auth-store", storage: safeStorage }
  )
);
