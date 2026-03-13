CREATE TABLE `category` (
	`id` char(36) NOT NULL,
	`store_id` char(36) NOT NULL,
	`category` varchar(255) NOT NULL,
	CONSTRAINT `category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` char(36) NOT NULL,
	`store_id` char(36) NOT NULL,
	`order_status` varchar(120) NOT NULL,
	`order_identifier` varchar(255) NOT NULL,
	`telegram_user_id` bigint NOT NULL,
	`order_delivery_instruction` varchar(1000) NOT NULL,
	`order_custom_message` varchar(2500),
	`order_shipping_method` char(36) NOT NULL,
	`order_payment_method` char(36) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` char(36) NOT NULL,
	`store_id` char(36) NOT NULL,
	`method` varchar(255) NOT NULL,
	CONSTRAINT `payment_methods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` char(36) NOT NULL,
	`store_id` char(36) NOT NULL,
	`product_name` varchar(120) NOT NULL,
	`product_price` decimal(10,2) NOT NULL,
	`product_desc` text,
	`image_url` varchar(512),
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`visible` tinyint DEFAULT 1,
	`category_id` char(36),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products_orders` (
	`id` char(36) NOT NULL,
	`order_id` char(36) NOT NULL,
	`product_id` char(36) NOT NULL,
	CONSTRAINT `products_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shipping_methods` (
	`id` char(36) NOT NULL,
	`store_id` char(36) NOT NULL,
	`method` varchar(255) NOT NULL,
	CONSTRAINT `shipping_methods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`store_type` enum('public','private') NOT NULL DEFAULT 'public',
	`store_name` varchar(120) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	`store_currency` varchar(3) DEFAULT 'EUR',
	`store_expire_date` datetime(3),
	CONSTRAINT `stores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` char(36) NOT NULL,
	`telegram_user_id` bigint,
	`created_at` datetime(3) NOT NULL DEFAULT (now(3)),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_users_telegram_user_id` UNIQUE(`telegram_user_id`)
);
--> statement-breakpoint
ALTER TABLE `category` ADD CONSTRAINT `category_store_id_stores_id_fk` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_store_id_stores_id_fk` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_order_shipping_method_shipping_methods_id_fk` FOREIGN KEY (`order_shipping_method`) REFERENCES `shipping_methods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_order_payment_method_payment_methods_id_fk` FOREIGN KEY (`order_payment_method`) REFERENCES `payment_methods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_store_id_stores_id_fk` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_store_id_stores_id_fk` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `products_orders` ADD CONSTRAINT `products_orders_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products_orders` ADD CONSTRAINT `products_orders_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shipping_methods` ADD CONSTRAINT `shipping_methods_store_id_stores_id_fk` FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stores` ADD CONSTRAINT `stores_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_orders_store_id` ON `orders` (`store_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_status` ON `orders` (`order_status`);--> statement-breakpoint
CREATE INDEX `idx_orders_shipping_method` ON `orders` (`order_shipping_method`);--> statement-breakpoint
CREATE INDEX `idx_orders_payment_method` ON `orders` (`order_payment_method`);--> statement-breakpoint
CREATE INDEX `idx_paymentMethods_store_id` ON `payment_methods` (`store_id`);--> statement-breakpoint
CREATE INDEX `fk_category` ON `products` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_id` ON `products_orders` (`order_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_product_id` ON `products_orders` (`product_id`);--> statement-breakpoint
CREATE INDEX `idx_shippingMethods_store_id` ON `shipping_methods` (`store_id`);--> statement-breakpoint
CREATE INDEX `idx_stores_user_id` ON `stores` (`user_id`);