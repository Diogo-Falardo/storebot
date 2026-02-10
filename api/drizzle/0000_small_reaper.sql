-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `link_tokens` (
	`token_hash` char(64) NOT NULL,
	`user_id` char(36) NOT NULL,
	`expires_at` datetime(3) NOT NULL,
	`used_at` datetime(3),
	`created_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	CONSTRAINT `link_tokens_token_hash` PRIMARY KEY(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `shops` (
	`id` char(36) NOT NULL,
	`user_id` char(36) NOT NULL,
	`shop_type` enum('public','private','telegram_only') NOT NULL DEFAULT 'public',
	`shop_name` varchar(120) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	CONSTRAINT `shops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` char(36) NOT NULL,
	`clerk_user_id` varchar(191),
	`telegram_user_id` bigint,
	`created_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_users_clerk_user_id` UNIQUE(`clerk_user_id`),
	CONSTRAINT `uq_users_telegram_user_id` UNIQUE(`telegram_user_id`)
);
--> statement-breakpoint
ALTER TABLE `link_tokens` ADD CONSTRAINT `fk_link_tokens_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shops` ADD CONSTRAINT `fk_shops_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_link_tokens_user_id` ON `link_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_shops_user_id` ON `shops` (`user_id`);
*/