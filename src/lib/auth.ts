import { loginSchema } from "@/app/(auth)/schema";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { $Enums, UserRole } from "@prisma/client";
import NextAuth, { DefaultSession, User } from "next-auth";
import { encode as defaultEncode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { v4 as uuid } from "uuid";
import { ZodError } from "zod";
import { comparePassword } from "./bcrypt";
import { FORBIDDEN_ROUTE, LOGIN_ROUTE } from "./const";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface User {
    role: UserRole;
  }
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

const adapter = PrismaAdapter(prisma);
export const { handlers, signIn, signOut, auth } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  adapter,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("Email atau password salah");
          }

          if (!user.password) {
            throw new Error("Akun anda terdaftar dengan metode lain");
          }

          const isValidPassword = comparePassword(password, user.password);
          if (!isValidPassword) {
            throw new Error("Email atau password salah");
          }
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});

export async function getUserAndValidateRoles<
  T extends $Enums.UserRole[],
  U extends boolean = false
>({
  roles,
  forceRedirect,
}: {
  roles: T;
  forceRedirect: U;
}): Promise<U extends true ? User : User | null> {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    if (forceRedirect) {
      redirect(LOGIN_ROUTE);
    }
    return null as U extends true ? User : User | null;
  }

  if (!roles.includes(user.role)) {
    if (forceRedirect) {
      redirect(FORBIDDEN_ROUTE);
    }
    return null as U extends true ? User : User | null;
  }

  return user;
}
