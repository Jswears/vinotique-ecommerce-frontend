import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { fetchAuthSession } from "aws-amplify/auth";

Amplify.configure(outputs);

export async function isAuthenticatedAsAdmin() {
  try {
    const session = await fetchAuthSession();

    const isAuthenticated =
      session?.tokens?.accessToken !== undefined &&
      session?.tokens?.idToken !== undefined;

    const userGroups: string[] = Array.isArray(
      session?.tokens?.idToken?.payload?.["cognito:groups"]
    )
      ? session?.tokens?.idToken?.payload?.["cognito:groups"].filter(
          (group: any) => typeof group === "string"
        )
      : [];

    if (isAuthenticated && userGroups.includes("ADMINS")) {
      console.log("User is authenticated as an admin.");
      return true;
    }
    console.log("User is not authenticated as an admin.");
    return false;
  } catch (error) {
    console.error("Session error:", error);
    return false;
  }
}
