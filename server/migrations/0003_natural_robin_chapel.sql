DO $$ BEGIN
 CREATE TYPE "public"."roles" AS ENUM('user', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP TABLE "posts";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "roles" "roles" DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "password";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "customerID";