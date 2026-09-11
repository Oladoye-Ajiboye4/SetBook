import { pgTable, uuid, varchar, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('user_role', ['admin', 'customer']);

export const User = pgTable("users", {
  user_id: uuid().defaultRandom().primaryKey(),
  username: varchar({ length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: roleEnum().notNull().default('customer'),
  isVerified: boolean('is_verified').default(false),
  hashedEmailVerificationToken: varchar(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
