ALTER TABLE "subscribers" DROP CONSTRAINT "subscribers_polar_customer_id_polar_customers_polar_customer_id_fk";
--> statement-breakpoint
DROP INDEX "subscribers_polar_customer_id_idx";--> statement-breakpoint
ALTER TABLE "subscribers" DROP COLUMN "polar_customer_id";