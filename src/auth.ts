import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./lib/schemas/loginSchema";
import { getUserByEmail } from "./app/actions/authActions";
import { compare } from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        passwordHash: {},
      },
      authorize: async (credentials) => {
        let user = null;

        const validated = loginSchema.safeParse(credentials);

        if (validated.success) {
          const { email, password } = validated.data;

          user = await getUserByEmail(email);

          if (
            !user ||
            !user.passwordHash ||
            !(await compare(password, user.passwordHash))
          )
            return null;

          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt(jwt_token) {
      console.log("jwt token", jwt_token);

      // jwt token {
      //   token: {
      //     token: {
      //       name: 'Joe',
      //       email: 'joe@test.com',
      //       picture: null,
      //       sub: 'cm1822stl000148nq2ybj6ny5'
      //     },
      //     user: {
      //       id: 'cm1822stl000148nq2ybj6ny5',
      //       name: 'Joe',
      //       email: 'joe@test.com',
      //       emailVerified: null,
      //       passwordHash: '$2a$10$AcpWFUraEFVsuNMTg2RTKO1seN4MhDKawyKJLF4ODkG',
      //       image: null,
      //       createdAt: '2024-09-18T16:06:51.753Z',
      //       updatedAt: '2024-09-18T16:06:51.753Z'
      //     },
      //     account: {
      //       providerAccountId: 'cm1822stl000148nq2ybj6ny5',
      //       type: 'credentials',
      //       provider: 'credentials'
      //     },
      //     isNewUser: false,
      //     trigger: 'signIn',
      //     iat: 1726735785,
      //     exp: 1729327785,
      //     jti: '2dde5464-8c68-4884-b8b5-188cd4336a7f'
      //   },
      //   session: undefined
      // }

      // return value will be passed to the session callback as 'token'.
      // if no jwt callback is defined, the whole jwt_token will be passed to the
      // session callback as 'token'. By passing the jwt_token.token to the
      // session callback, it will populate the user data in the session object.
      return jwt_token.token ? jwt_token.token : null;
    },
    async session(session_token) {
      console.log("session", session_token);

      // return value will be passed to the client side -- be careful with sensitive data!!
      return session_token.session;
    },
    // async session(session_token) {
    //   token consists of whatever the jwt callback returns
    //   const { session, token } = session_token;

    //   console.log("session_token", session_token);
    //   console.log("session", session);
    //   console.log("token", token)

    //   if (token.sub && session.user) {
    //     session.user.id = token.sub;
    //   }

    //   console.log("user", session.user);

    //   return session.user;
    // },
  },
});
