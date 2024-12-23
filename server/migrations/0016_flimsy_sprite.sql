ALTER TABLE "orderProduct" RENAME TO "order_product";--> statement-breakpoint
ALTER TABLE "order_product" DROP CONSTRAINT "orderProduct_productVariantID_productVariants_id_fk";
--> statement-breakpoint
ALTER TABLE "order_product" DROP CONSTRAINT "orderProduct_productID_products_id_fk";
--> statement-breakpoint
ALTER TABLE "order_product" DROP CONSTRAINT "orderProduct_orderID_orders_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_product" ADD CONSTRAINT "order_product_productVariantID_productVariants_id_fk" FOREIGN KEY ("productVariantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_product" ADD CONSTRAINT "order_product_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_product" ADD CONSTRAINT "order_product_orderID_orders_id_fk" FOREIGN KEY ("orderID") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DROP TABLE IF EXISTS order_product CASCADE;
