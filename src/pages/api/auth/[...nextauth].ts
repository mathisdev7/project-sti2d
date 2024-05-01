import { prisma } from "@/lib/prismaClient";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { AuthOptions, User } from "next-auth";
import NextAuth, { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    Credentials({
      id: "credential",
      name: "Sign in",
      credentials: {
        username: {
          label: "E-mail",
          type: "text",
          placeholder: "E-mail",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password)
          return null;
        const dbUser = await prisma.user.findFirst({
          where: {
            username: credentials.username,
          },
        });
        if (!dbUser) return null;
        const passwordMatch = bcrypt.compare(
          credentials.password,
          dbUser?.password as string
        );
        if (await passwordMatch) {
          const dbUserWithoutPassword: Object = {
            email: dbUser.email,
            username: dbUser.username,
            id: dbUser.id,
            admin: dbUser.admin,
          };
          return dbUserWithoutPassword as User;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.admin = user.admin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.admin = token.admin as boolean;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

export default NextAuth(authOptions);
