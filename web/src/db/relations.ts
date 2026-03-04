import { relations } from "drizzle-orm/relations";
import { shops, category, products, users } from "./schema";

export const categoryRelations = relations(category, ({one}) => ({
	shop: one(shops, {
		fields: [category.shopId],
		references: [shops.id]
	}),
}));

export const shopsRelations = relations(shops, ({one, many}) => ({
	categories: many(category),
	products_shopId: many(products, {
		relationName: "products_shopId_shops_id"
	}),
	products_shopId: many(products, {
		relationName: "products_shopId_shops_id"
	}),
	user: one(users, {
		fields: [shops.userId],
		references: [users.id]
	}),
}));

export const productsRelations = relations(products, ({one}) => ({
	shop_shopId: one(shops, {
		fields: [products.shopId],
		references: [shops.id],
		relationName: "products_shopId_shops_id"
	}),
	shop_shopId: one(shops, {
		fields: [products.shopId],
		references: [shops.id],
		relationName: "products_shopId_shops_id"
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	shops: many(shops),
}));