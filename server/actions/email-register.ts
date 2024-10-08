"use server";

import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";
import bcrypt from "bcrypt";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationsEmail } from "./email";

const action = createSafeActionClient();

export const emailRegister = action
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationsToken = await generateEmailVerificationToken(email);

        await sendVerificationsEmail(
          verificationsToken[0].email,
          verificationsToken[0].token
        );

        return { success: "Email Confirmation resent" };
      }
      return { error: "Email already in use" };
    }

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    const verificationsToken = await generateEmailVerificationToken(email);

    await sendVerificationsEmail(
      verificationsToken[0].email,
      verificationsToken[0].token
    );

    return { success: "Confirmation Email Sent" };
  });
