import { pgTable, varchar, timestamp, unique, boolean, text, foreignKey, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const verification = pgTable("verification", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	identifier: varchar({ length: 255 }).notNull(),
	value: varchar({ length: 255 }).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const user = pgTable("user", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	role: varchar({ length: 50 }).default('user'),
	banned: boolean().default(false),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires", { mode: 'string' }),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const account = pgTable("account", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	accountId: varchar("account_id", { length: 255 }).notNull(),
	providerId: varchar("provider_id", { length: 255 }).notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: varchar({ length: 255 }),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	ipAddress: varchar("ip_address", { length: 255 }),
	userAgent: text("user_agent"),
	userId: varchar("user_id", { length: 36 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const application = pgTable("application", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	applicationId: varchar("application_id", { length: 20 }).notNull(),
	fullName: varchar("full_name", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	projectType: varchar("project_type", { length: 100 }).notNull(),
	budgetRange: varchar("budget_range", { length: 100 }).notNull(),
	timeline: varchar({ length: 100 }).notNull(),
	description: text().notNull(),
	status: varchar({ length: 50 }).default('submitted').notNull(),
	adminNotes: text("admin_notes"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("application_application_id_unique").on(table.applicationId),
]);

export const statusHistory = pgTable("status_history", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	applicationUuid: uuid("application_uuid").notNull(),
	fromStatus: varchar("from_status", { length: 50 }),
	toStatus: varchar("to_status", { length: 50 }).notNull(),
	changedBy: varchar("changed_by", { length: 36 }),
	note: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.applicationUuid],
			foreignColumns: [application.id],
			name: "status_history_application_uuid_application_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.changedBy],
			foreignColumns: [user.id],
			name: "status_history_changed_by_user_id_fk"
		}),
]);
