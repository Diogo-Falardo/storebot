CREATE TABLE `category` (
	`id` char(36) NOT NULL DEFAULT (uuid()),
	`shop_id` char(36) NOT NULL,
	`category` varchar(255) NOT NULL,
	CONSTRAINT `category_id` PRIMARY KEY(`id`)
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
ALTER TABLE `products` ADD CONSTRAINT `products_shop_id_shops_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shops` ADD CONSTRAINT `shops_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `fk_category` ON `products` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_shops_user_id` ON `shops` (`user_id`);