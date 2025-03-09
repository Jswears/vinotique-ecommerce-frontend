import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";

interface AuthStore {
  user?: {
    username: string;
    userId: string;
    email: string;
    isAdmin: boolean;
    accessToken: string;
    expiration: number;
  };
  fetchUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: undefined,

      fetchUser: async () => {
        try {
          const session = await fetchAuthSession();
          if (!session.tokens) return;

          const accessToken = session.tokens.accessToken;
          const userAttributes = await fetchUserAttributes();
          const currentUser = await getCurrentUser();
          console.log(accessToken.payload);
          const user = {
            username: currentUser.username,
            email: userAttributes.email || "",
            userId: userAttributes.sub || "",
            isAdmin:
              (Array.isArray(accessToken.payload["cognito:groups"]) &&
                accessToken.payload["cognito:groups"].includes("ADMINS")) ||
              false,
            accessToken: accessToken.toString(),
            expiration: accessToken.payload.exp
              ? accessToken.payload.exp * 1000
              : 0, // Convert to milliseconds
          };

          set({ user });
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      },

      refreshToken: async () => {
        const user = get().user;
        if (!user) return;

        const now = Date.now();
        if (user.expiration > now) return; // Token is still valid

        console.log("Refreshing token...");
        await get().fetchUser();
      },

      logout: async () => {
        try {
          await signOut();
          set({ user: undefined });
        } catch (error) {
          console.error("Error logging out:", error);
        }
      },

      initAuth: () => {
        get().fetchUser();
      },
    }),
    { name: "auth-store" }
  )
);
