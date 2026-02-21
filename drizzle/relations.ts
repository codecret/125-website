import { relations } from "drizzle-orm/relations";
import { user, account, session, application, statusHistory } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
	statusHistories: many(statusHistory),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const statusHistoryRelations = relations(statusHistory, ({one}) => ({
	application: one(application, {
		fields: [statusHistory.applicationUuid],
		references: [application.id]
	}),
	user: one(user, {
		fields: [statusHistory.changedBy],
		references: [user.id]
	}),
}));

export const applicationRelations = relations(application, ({many}) => ({
	statusHistories: many(statusHistory),
}));