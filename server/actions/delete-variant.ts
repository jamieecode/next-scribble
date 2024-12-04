"use server";

import * as z from "zod";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

const action = createSafeActionClient();

export const deleteVariant = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();

      await client.deleteObject({
        indexName: "products",
        objectID: deletedVariant[0].id.toString(),
      });

      revalidatePath("dashboard/products");

      return { success: `Deleted ${deletedVariant[0].productType}` };
    } catch (error) {
      return { error: "Failed to delete variant" };
    }
  });
