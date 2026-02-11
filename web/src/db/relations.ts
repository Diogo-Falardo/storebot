import { relations } from "drizzle-orm/relations";
import { users, linkTokens, shops } from "./schema";

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

export const shopsRelations = relations(shops, ({one}) => ({
	user: one(users, {
		fields: [shops.userId],
		references: [users.id]
	}),
}));