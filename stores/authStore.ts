import { create } from "zustand";
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";

interface AuthStore {
  user?: Record<string, any>;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: undefined,
  fetchUser: async () => {
    try {
      const session = await fetchAuthSession();
      if (!session.tokens) {
        return;
      }
      const rawToken = session.tokens.accessToken.payload;
      const user = {
        ...(await getCurrentUser()),
        ...(await fetchUserAttributes()),
        isAdmin: false,
        accessToken: rawToken,
      };
      console.log(user);
      const groups = session.tokens.accessToken.payload["cognito:groups"];
      // @ts-ignore
      user.isAdmin = Boolean(groups && groups.includes("ADMINS"));
      set({ user });
    } catch (error) {
      console.error("Error fetching user", error);
    }
  },
  logout: async () => {
    try {
      await signOut();
      set({ user: undefined });
    } catch (error) {
      console.error("Error logging out", error);
    }
  },
  initAuth: () => {
    if (!get().user) {
      get().fetchUser();
    }
  },
}));
