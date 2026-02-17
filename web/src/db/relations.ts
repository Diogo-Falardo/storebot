import { relations } from "drizzle-orm/relations";
import { shops, products, users } from "./schema";

export const productsRelations = relations(products, ({one}) => ({
	shop: one(shops, {
		fields: [products.shopId],
		references: [shops.id]
	}),
}));

export const shopsRelations = relations(shops, ({one, many}) => ({
	products: many(products),
	user: one(users, {
		fields: [shops.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	shops: many(shops),
}));