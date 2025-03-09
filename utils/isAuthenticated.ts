// import { Amplify } from "aws-amplify";
// import outputs from "@/amplify_outputs.json";
// import { fetchAuthSession } from "aws-amplify/auth";
// import { useAuthStore } from "@/stores/authStore";
// import useCartStore from "@/stores/cartStore";

// Amplify.configure(outputs);

// export async function isAuthenticatedAsAdmin() {
//   try {
//     const authStore = useAuthStore.getState();
//     const previousUserId = authStore.userId; // store guest/previous id
//     const session = await fetchAuthSession();

//     const isAuthenticated =
//       session?.tokens?.accessToken !== undefined &&
//       session?.tokens?.idToken !== undefined;

//     const userGroups: string[] = Array.isArray(
//       session?.tokens?.idToken?.payload?.["cognito:groups"]
//     )
//       ? session?.tokens?.idToken?.payload?.["cognito:groups"].filter(
//           (group) => typeof group === "string"
//         )
//       : [];

//     if (isAuthenticated && userGroups.includes("ADMINS")) {
//       const userId = session?.tokens?.idToken?.payload?.["cognito:username"];
//       if (typeof userId === "string") {
//         authStore.setUserId(userId);
//         // If previous guest id differs, transfer the cart
//         if (previousUserId && previousUserId !== userId) {
//           await useCartStore.getState().transferCart(previousUserId, userId);
//         }
//         authStore.setIsAuthenticatedAsAdmin(true);
//         await useCartStore.getState().fetchCart();
//       } else {
//         console.error("userId is not a string:", userId);
//       }
//       return true;
//     } else if (isAuthenticated && userGroups.includes("USERS")) {
//       authStore.setIsAuthenticated(true);
//       // Use authenticated userSub as id for USERS
//       const userId = session?.userSub;
//       if (typeof userId === "string") {
//         authStore.setUserId(userId);
//         if (previousUserId && previousUserId !== userId) {
//           await useCartStore.getState().transferCart(previousUserId, userId);
//         }
//         await useCartStore.getState().fetchCart();
//       } else {
//         console.error("userId is not a string:", userId);
//       }
//       return false;
//     } else if (!isAuthenticated) {
//       authStore.setIsAuthenticated(false);
//       // authStore.logout();
//       const identityId = session?.identityId;
//       if (typeof identityId === "string") {
//         authStore.setUserId(identityId);
//       }
//       await useCartStore.getState().fetchCart();
//       return false;
//     }
//   } catch (error) {
//     console.error("Session error:", error);
//     return false;
//   }
// }
