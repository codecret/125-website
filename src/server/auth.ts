import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const extraOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS
  ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : [];

export const auth = betterAuth({
  baseURL,
  trustedOrigins: [
    baseURL,
    "http://localhost:3000",
    "https://125.codecret.com",
    ...extraOrigins,
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin()],
});

export type Session = typeof auth.$Infer.Session;
