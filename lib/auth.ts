import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { getSession } from "next-auth/react";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
});

export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.user?.email) {
    return null;
  }

  return session.user;
}
