import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Single-admin allowlist. Only this email may sign in or hit write endpoints.
 * Override per-environment with the ADMIN_EMAIL env var.
 */
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "hejoric@gmail.com").toLowerCase();

export function isAdmin(email?: string | null): boolean {
  return !!email && email.toLowerCase() === ADMIN_EMAIL;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Reject the sign-in entirely for anyone who isn't the admin.
    async signIn({ user }) {
      return isAdmin(user.email);
    },
    async authorized({ auth: session }) {
      return isAdmin(session?.user?.email);
    },
  },
});
