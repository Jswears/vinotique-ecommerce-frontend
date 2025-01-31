import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Welcome to Vinotique!🍷 Confirm your email",
      verificationEmailBody: (createCode) =>
        `Your verification code is ${createCode}`,
    },
  },
  userAttributes: {
    email: {
      mutable: true,
      required: true,
    },
    "custom:username": {
      dataType: "String",
      mutable: true,
      maxLen: 50,
      minLen: 3,
    },
  },
  groups: ["ADMINS", "USERS"],
  triggers: {
    postConfirmation,
  },
  access: (allow) => [allow.resource(postConfirmation).to(["addUserToGroup"])],
});
