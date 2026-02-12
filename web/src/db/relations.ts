import { relations } from "drizzle-orm/relations";
import { users, linkTokens, shops, products } from "./schema";

export const linkTokensRelations = relations(linkTokens, ({one}) => ({
	user: one(users, {
		fields: [linkTokens.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	linkTokens: many(linkTokens),
	shops: many(shops),
}));

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