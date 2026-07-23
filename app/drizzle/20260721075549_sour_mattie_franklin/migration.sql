CREATE TYPE "currency" AS ENUM('USD', 'EUR', 'RUB', 'UAH', 'GBP', 'BRL', 'TRY', 'INR', 'IDR', 'KZT', 'PLN', 'ARS');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('owner', 'client');--> statement-breakpoint
CREATE TABLE "shop_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"shop_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "role" DEFAULT 'client'::"role" NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"timeout_until" timestamp with time zone,
	"member_since" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shop_payment_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"shop_id" uuid NOT NULL,
	"method" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shop_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"shop_id" uuid NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"description" text,
	"images" text,
	"hidden" boolean DEFAULT false NOT NULL,
	"out_of_stock" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shop_shipping_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"shop_id" uuid NOT NULL,
	"method" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shops" RENAME COLUMN "user_Id" TO "user_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "create_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "shops" ADD COLUMN "currency" "currency" DEFAULT 'EUR'::"currency" NOT NULL;--> statement-breakpoint
ALTER TABLE "shops" ADD CONSTRAINT "shops_user_id_key" UNIQUE("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "shop_clients_shop_user_uindx" ON "shop_clients" ("shop_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_telegram_user_id_uidx" ON "users" ("telegram_user_id");--> statement-breakpoint
ALTER TABLE "shop_clients" ADD CONSTRAINT "shop_clients_shop_id_shops_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "shop_clients" ADD CONSTRAINT "shop_clients_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "shop_payment_methods" ADD CONSTRAINT "shop_payment_methods_shop_id_shops_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "shop_products" ADD CONSTRAINT "shop_products_shop_id_shops_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "shop_shipping_methods" ADD CONSTRAINT "shop_shipping_methods_shop_id_shops_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE;