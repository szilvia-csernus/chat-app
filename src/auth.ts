import NextAuth, { Account, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Linkedin from "next-auth/providers/linkedin";
import { loginCredentialsSchema } from "./lib/schemas/loginCredentialsSchema";
import { getUserByEmail, getUserCredentials } from "./app/actions/authActions";
import { compare } from "bcryptjs";
// import Passkey from "next-auth/providers/passkey";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // experimental: { enableWebAuthn: true },
  providers: [
    // Passkey,
    Google({
      allowDangerousEmailAccountLinking: true
    }),
    Github({
      allowDangerousEmailAccountLinking: true
    }),
    Linkedin({
      allowDangerousEmailAccountLinking: true
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt(jwt_token: {
      token: JWT;
      user?: User;
      account?: Account | null;
      profile?: any;
    }) {
      if (jwt_token.user) {
        jwt_token.token.sub = jwt_token.user.id;
        jwt_token.token.provider = jwt_token.account?.provider;
        jwt_token.token.picture =
          jwt_token.profile?.picture || jwt_token.user.image;
        jwt_token.token.name = jwt_token.profile?.name;
      }
      // console.log("jwt token", jwt_token.token);
      // return value will be passed to the session callback as 'token'.
      // if no jwt callback is defined, only a safe subset of the jwt_token will be passed to the
      // session callback as 'token'. By passing the jwt_token.token to the
      // session callback, it will populate the user data in the session object.
      return jwt_token.token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.sub;
      session.user.provider = token.provider;
      session.user.image = token.picture;
      session.user.name = token.name;
      console.log("session token user", session);
      // return value will be passed to the client side -- be careful with sensitive data!!

      return session;
    },
  },
});
