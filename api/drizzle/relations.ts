import { relations } from "drizzle-orm/relations";
import { shops, category, paymentMethods, orders, shippingMethods, products, productsOrders, users } from "./schema";

export const categoryRelations = relations(category, ({one}) => ({
	shop: one(shops, {
		fields: [category.shopId],
		references: [shops.id]
	}),
}));

export const shopsRelations = relations(shops, ({one, many}) => ({
	categories: many(category),
	orders: many(orders),
	paymentMethods: many(paymentMethods),
	products: many(products),
	shippingMethods: many(shippingMethods),
	user: one(users, {
		fields: [shops.userId],
		references: [users.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	paymentMethod: one(paymentMethods, {
		fields: [orders.orderPaymentMethod],
		references: [paymentMethods.id]
	}),
	shippingMethod: one(shippingMethods, {
		fields: [orders.orderShippingMethod],
		references: [shippingMethods.id]
	}),
	shop: one(shops, {
		fields: [orders.shopId],
		references: [shops.id]
	}),
	productsOrders: many(productsOrders),
}));

export const paymentMethodsRelations = relations(paymentMethods, ({one, many}) => ({
	orders: many(orders),
	shop: one(shops, {
		fields: [paymentMethods.shopId],
		references: [shops.id]
	}),
}));

export const shippingMethodsRelations = relations(shippingMethods, ({one, many}) => ({
	orders: many(orders),
	shop: one(shops, {
		fields: [shippingMethods.shopId],
		references: [shops.id]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	shop: one(shops, {
		fields: [products.shopId],
		references: [shops.id]
	}),
	productsOrders: many(productsOrders),
}));

export const productsOrdersRelations = relations(productsOrders, ({one}) => ({
	order: one(orders, {
		fields: [productsOrders.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [productsOrders.productId],
		references: [products.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	shops: many(shops),
}));