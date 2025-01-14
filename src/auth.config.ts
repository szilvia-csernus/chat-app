import { Account, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Linkedin from "next-auth/providers/linkedin";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Linkedin({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
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
      // console.log("session token user", session);
      // return value will be passed to the client side -- be careful with sensitive data!!

      return session;
    },
  },
} satisfies NextAuthConfig;
