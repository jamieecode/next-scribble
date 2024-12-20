"use server";

import { PaymentIntentSchema } from "@/types/payment-intent-schema";
import { createSafeActionClient } from "next-safe-action";
import { Stripe } from "stripe";
import { auth } from "../auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const action = createSafeActionClient();

export const createPaymentIntent = action
  .schema(PaymentIntentSchema)
  .action(async ({ parsedInput: { amount, currency, cart } }) => {
    const user = await auth();

    if (!user) return { error: "Please login to continue" };
    if (!amount) return { error: "No Product to checkout" };

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        cart: JSON.stringify(cart),
      },
    });

    return {
      success: {
        paymentIntentID: paymentIntent.id,
        clientSecretID: paymentIntent.client_secret,
        user: user.user?.email,
      },
    };
  });
