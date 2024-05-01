import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      email: string;
      username: string;
      id: string;
      admin: boolean;
    };
  }

  interface AdapterUser {
    id: string;
    email: string;
    username: string;
    admin: boolean;
  }

  interface User {
    email: string;
    username: string;
    id: string;
    admin: boolean;
  }
}
