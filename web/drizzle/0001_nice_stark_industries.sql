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
CREATE TABLE `paymentMethods` (
	`id` char(36) NOT NULL DEFAULT (uuid()),
	`shop_id` char(36) NOT NULL,
	`method` varchar(255) NOT NULL,
	CONSTRAINT `paymentMethods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productsOrders` (
	`id` char(36) NOT NULL DEFAULT (uuid()),
	`order_id` char(36) NOT NULL,
	`product_id` char(36) NOT NULL,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shippingMethods` (
	`id` char(36) NOT NULL DEFAULT (uuid()),
	`shop_id` char(36) NOT NULL,
	`method` varchar(255) NOT NULL,
	CONSTRAINT `shippingMethods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_shop_id_shops_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_order_shipping_method_shippingMethods_id_fk` FOREIGN KEY (`order_shipping_method`) REFERENCES `shippingMethods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_order_payment_method_paymentMethods_id_fk` FOREIGN KEY (`order_payment_method`) REFERENCES `paymentMethods`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `paymentMethods` ADD CONSTRAINT `paymentMethods_shop_id_shops_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `productsOrders` ADD CONSTRAINT `productsOrders_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `productsOrders` ADD CONSTRAINT `productsOrders_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shippingMethods` ADD CONSTRAINT `shippingMethods_shop_id_shops_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_orders_shop_id` ON `orders` (`shop_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_status` ON `orders` (`order_status`);--> statement-breakpoint
CREATE INDEX `idx_orders_shipping_method` ON `orders` (`order_shipping_method`);--> statement-breakpoint
CREATE INDEX `idx_orders_payment_method` ON `orders` (`order_payment_method`);--> statement-breakpoint
CREATE INDEX `idx_paymentMethods_shop_id` ON `paymentMethods` (`shop_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_id` ON `productsOrders` (`order_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_product_id` ON `productsOrders` (`product_id`);--> statement-breakpoint
CREATE INDEX `idx_shippingMethods_shop_id` ON `shippingMethods` (`shop_id`);