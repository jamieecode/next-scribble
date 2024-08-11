"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { emailTokens } from "../schema";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationsToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, email),
    });

    return verificationsToken;
  } catch (error) {
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  }

  const verificationsToken = await db.insert(emailTokens).values({
    email,
    token,
    expires,
  });

  return verificationsToken;
};
