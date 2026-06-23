import { db } from "@/db";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { restrictedUsernames } from "./usernames";
console.log("[auth config] accountLinking enabled:", true);
export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [username({
    minUsernameLength: 4,
      maxUsernameLength: 10,
      usernameValidator: (value) => !restrictedUsernames.includes(value),
      usernameNormalization: (value) => value.toLowerCase(),
  })],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
        input: false,
      },
      gender: {
        type: "boolean",
        required: false,
        input: true,
        defaultValue: false,
      },
    },
  },
  
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"], // 信任 Google 邮箱已验证，允许自动关联
    },
  },
});
console.log("[auth config] accountLinking enabled:", true);