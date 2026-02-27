import { relations } from "drizzle-orm/relations";
import { shops, category, products, users } from "./schema";

export const categoryRelations = relations(category, ({one, many}) => ({
	shop: one(shops, {
		fields: [category.shopId],
		references: [shops.id]
	}),
	products: many(products),
}));

export const shopsRelations = relations(shops, ({one, many}) => ({
	categories: many(category),
	products: many(products),
	user: one(users, {
		fields: [shops.userId],
		references: [users.id]
	}),
}));

export const productsRelations = relations(products, ({one}) => ({
	category: one(category, {
		fields: [products.categoryId],
		references: [category.id]
	}),
	shop: one(shops, {
		fields: [products.shopId],
		references: [shops.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	shops: many(shops),
}));