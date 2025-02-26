"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { twoFactorTokens, users } from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";
import { sendTwoFactorTokenByEmail, sendVerificationsEmail } from "./email";
import { signIn } from "../auth";

const action = createSafeActionClient();

export const emailSignIn = action
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "Email not found" };
      }

      if (!existingUser?.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );
        await sendVerificationsEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return { success: "Confirmation Email Sent!" };
      }

      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          if (!twoFactorToken) {
            return { error: "Invalid Token" };
          }

          if (twoFactorToken.token !== code) {
            return { error: "Invalid Token" };
          }

          const hasExpired = new Date(twoFactorToken.expires) < new Date();

          if (hasExpired) {
            return { error: "Token has expired" };
          }

          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existingUser.email);

          if (!token) {
            return { error: "Token not generated!" };
          }

          await sendTwoFactorTokenByEmail(token[0].email, token[0].token);
          return { twoFactor: "Two Factor Token Sent!" };
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: email };
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        switch (true) {
          case error.message.includes("CredentialsSignin"):
            return { error: "Incorrect email or password" };

          case error.message.includes("AccessDenied"):
            return { error: error.message };

          case error.message.includes("OAuthSignInError"):
            return { error: error.message };

          default:
            return { error: "Something went wrong" };
        }
      }

      throw error;
    }
  });
