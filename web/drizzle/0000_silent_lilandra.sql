CREATE TABLE `category` (
	`id` char(36) NOT NULL DEFAULT (uuid()),
	`shop_id` char(36) NOT NULL,
	`category` varchar(255) NOT NULL,
	CONSTRAINT `category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` char(36) NOT NULL DEFAULT (uuid()),
	`shop_id` char(36) NOT NULL,
	`order_status` varchar(120) NOT NULL,
	`order_custom_message` varchar(2500),
	`order_shipping_method` char(36) NOT NULL,
	`order_payment_method` char(36) NOT NULL,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` char(36) NOT NULL DEFAULT (uuid()),
	`shop_id` char(36) NOT NULL,
	`method` varchar(255) NOT NULL,
	CONSTRAINT `paymentMethods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` char(36) NOT NULL DEFAULT (uuid()),
	`shop_id` char(36) NOT NULL,
	`product_name` varchar(120) NOT NULL,
	`product_price` decimal(10,2) NOT NULL,
	`product_desc` text,
	`image_url` varchar(512),
	`created_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`visible` tinyint DEFAULT 1,
	`category_id` char(36),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products_orders` (
	`id` char(36) NOT NULL DEFAULT (uuid()),
	`order_id` char(36) NOT NULL,
	`product_id` char(36) NOT NULL,
	CONSTRAINT `productsOrders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shipping_methods` (
	`id` char(36) NOT NULL DEFAULT (uuid()),
	`shop_id` char(36) NOT NULL,
	`method` varchar(255) NOT NULL,
	CONSTRAINT `shippingMethods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shops` (
	`id` char(36) NOT NULL DEFAULT (uuid()),
	`user_id` char(36) NOT NULL,
	`shop_type` enum('public','private') NOT NULL DEFAULT 'public',
	`shop_name` varchar(120) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`ShopCurrency` varchar(3) DEFAULT 'EUR',
	CONSTRAINT `shops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` char(36) NOT NULL DEFAULT (uuid()),
	`telegram_user_id` bigint,
	`created_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_users_telegram_user_id` UNIQUE(`telegram_user_id`)
);
--> statement-breakpoint
ALTER TABLE `category` ADD CONSTRAINT `category_shop_id_shops_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_shop_id_shops_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_order_shipping_method_shipping_methods_id_fk` FOREIGN KEY (`order_shipping_method`) REFERENCES `shipping_methods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_order_payment_method_payment_methods_id_fk` FOREIGN KEY (`order_payment_method`) REFERENCES `payment_methods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_shop_id_shops_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_shop_id_shops_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products_orders` ADD CONSTRAINT `products_orders_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products_orders` ADD CONSTRAINT `products_orders_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shipping_methods` ADD CONSTRAINT `shipping_methods_shop_id_shops_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shops` ADD CONSTRAINT `shops_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_orders_shop_id` ON `orders` (`shop_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_status` ON `orders` (`order_status`);--> statement-breakpoint
CREATE INDEX `idx_orders_shipping_method` ON `orders` (`order_shipping_method`);--> statement-breakpoint
CREATE INDEX `idx_orders_payment_method` ON `orders` (`order_payment_method`);--> statement-breakpoint
CREATE INDEX `idx_paymentMethods_shop_id` ON `payment_methods` (`shop_id`);--> statement-breakpoint
CREATE INDEX `fk_category` ON `products` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_id` ON `products_orders` (`order_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_product_id` ON `products_orders` (`product_id`);--> statement-breakpoint
CREATE INDEX `idx_shippingMethods_shop_id` ON `shipping_methods` (`shop_id`);--> statement-breakpoint
CREATE INDEX `idx_shops_user_id` ON `shops` (`user_id`);