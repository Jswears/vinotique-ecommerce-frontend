import { createServerRunner, NextServer } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import outputs from "@/amplify_outputs.json";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export async function authenticatedUser(context: NextServer.Context) {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: context,
      operation: async (contextSpec) => {
        try {
          const session = await fetchAuthSession(contextSpec);
          if (!session.tokens) {
            return;
          }
          const user = {
            ...(await getCurrentUser(contextSpec)),
            isAdmin: false,
          };
          const groups = session.tokens.accessToken.payload["cognito:groups"];

          // @ts-ignore
          user.isAdmin = Boolean(groups && groups.includes("ADMINS"));

          return user;
        } catch (error) {
          console.error("Error getting current user", error);
          return null;
        }
      },
    });
    return currentUser;
  } catch (error) {
    console.error("Error getting current user", error);
    return null;
  }
}
