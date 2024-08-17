"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { users } from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationsEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

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

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: email };
    } catch (error) {
      console.log(error);

      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Incorrect email or password" };

          case "AccessDenied":
            return { error: error.message };

          case "OAuthSignInError":
            return { error: error.message };

          default:
            return { error: "Something went wrong" };
        }
      }

      throw error;
    }
  });
