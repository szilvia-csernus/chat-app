// eslint-disable-next-line
import NextAuth from "next-auth";

declare module "next-auth" {
  // Extend the User type
  interface User {
    profileComplete: boolean;
  }

  // Extend the Session type
  interface Session {
    user: {
      profileComplete?: boolean;
    } & DefaultSession["user"];
  }
}

// Extend the JWT type to include profileComplete
declare module "next-auth/jwt" {
  interface JWT {
    profileComplete: boolean;
  }
}

// Extend the AdapterUser type to include profileComplete
declare module "@auth/core/adapters" {
  interface AdapterUser {
    profileComplete: boolean;
  }
}
