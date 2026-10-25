import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../db";

const normalizeOrigin = (origin: string) => origin.replace(/\/+$/, "");
const configuredOrigin = (
  process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL
)
  ? normalizeOrigin(
      process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL!,
    )
  : undefined;
const trustedOrigins = [
  configuredOrigin,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
  ...(process.env.NODE_ENV === "development"
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : []),
]
  .filter((origin): origin is string => Boolean(origin))
  .map(normalizeOrigin);

export const auth = betterAuth({
  baseURL: configuredOrigin,
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["read:user", "user:email", "repo"],
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github"],
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  trustedOrigins,
});

export type Session = typeof auth.$Infer.Session;
