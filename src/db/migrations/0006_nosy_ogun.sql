CREATE TYPE "public"."billing_reason" AS ENUM('purchase', 'subscription_create', 'subscription_cycle', 'subscription_update');--> statement-breakpoint
CREATE TYPE "public"."checkout_status" AS ENUM('created', 'succeeded', 'failed', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'canceled', 'past_due', 'revoked');--> statement-breakpoint
CREATE TABLE "polar_checkouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"polar_customer_id" text,
	"polar_checkout_id" text NOT NULL,
	"status" "checkout_status" DEFAULT 'created' NOT NULL,
	"success_url" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "polar_checkouts_polar_checkout_id_unique" UNIQUE("polar_checkout_id")
);
--> statement-breakpoint
CREATE TABLE "polar_customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"polar_customer_id" text NOT NULL,
	"polar_customer_external_id" text,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "polar_customers_polar_customer_id_unique" UNIQUE("polar_customer_id"),
	CONSTRAINT "polar_customers_polar_customer_external_id_unique" UNIQUE("polar_customer_external_id")
);
--> statement-breakpoint
CREATE TABLE "polar_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"polar_customer_id" text,
	"polar_order_id" text NOT NULL,
	"polar_subscription_id" text,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'usd' NOT NULL,
	"billing_reason" "billing_reason",
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "polar_orders_polar_order_id_unique" UNIQUE("polar_order_id")
);
--> statement-breakpoint
CREATE TABLE "polar_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"polar_customer_id" text,
	"polar_subscription_id" text NOT NULL,
	"polar_product_id" text NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "polar_subscriptions_polar_subscription_id_unique" UNIQUE("polar_subscription_id")
);
--> statement-breakpoint
ALTER TABLE "subscribers" ADD COLUMN "polar_customer_id" text;--> statement-breakpoint
ALTER TABLE "polar_checkouts" ADD CONSTRAINT "polar_checkouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polar_customers" ADD CONSTRAINT "polar_customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polar_orders" ADD CONSTRAINT "polar_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polar_subscriptions" ADD CONSTRAINT "polar_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "polar_checkouts_user_id_idx" ON "polar_checkouts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "polar_checkouts_polar_customer_id_idx" ON "polar_checkouts" USING btree ("polar_customer_id");--> statement-breakpoint
CREATE INDEX "polar_checkouts_polar_checkout_id_idx" ON "polar_checkouts" USING btree ("polar_checkout_id");--> statement-breakpoint
CREATE INDEX "polar_checkouts_status_idx" ON "polar_checkouts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "polar_customers_user_id_idx" ON "polar_customers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "polar_customers_polar_customer_id_idx" ON "polar_customers" USING btree ("polar_customer_id");--> statement-breakpoint
CREATE INDEX "polar_customers_email_idx" ON "polar_customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "polar_orders_user_id_idx" ON "polar_orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "polar_orders_polar_customer_id_idx" ON "polar_orders" USING btree ("polar_customer_id");--> statement-breakpoint
CREATE INDEX "polar_orders_polar_order_id_idx" ON "polar_orders" USING btree ("polar_order_id");--> statement-breakpoint
CREATE INDEX "polar_orders_status_idx" ON "polar_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "polar_orders_billing_reason_idx" ON "polar_orders" USING btree ("billing_reason");--> statement-breakpoint
CREATE INDEX "polar_subscriptions_user_id_idx" ON "polar_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "polar_subscriptions_polar_customer_id_idx" ON "polar_subscriptions" USING btree ("polar_customer_id");--> statement-breakpoint
CREATE INDEX "polar_subscriptions_polar_subscription_id_idx" ON "polar_subscriptions" USING btree ("polar_subscription_id");--> statement-breakpoint
CREATE INDEX "polar_subscriptions_status_idx" ON "polar_subscriptions" USING btree ("status");--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_polar_customer_id_polar_customers_polar_customer_id_fk" FOREIGN KEY ("polar_customer_id") REFERENCES "public"."polar_customers"("polar_customer_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "subscribers_polar_customer_id_idx" ON "subscribers" USING btree ("polar_customer_id");