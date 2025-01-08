import { relations } from 'drizzle-orm'
import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { Person } from './person'

export const User = pgTable('User', {
  id: serial().primaryKey(),
  name: varchar({ length: 64 }).unique().notNull(),
  uid: varchar({ length: 64 }).unique().notNull(),
  password: varchar({ length: 512 }).notNull(),
  salt: varchar({ length: 512 }).notNull(),
  createdAt: timestamp({ withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: false })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  active: boolean().default(true).notNull(),
})

export const usersRelations = relations(User, ({ one }) => ({
  person: one(Person),
}))

export type UserRecord = typeof User.$inferSelect
export type UserPayload = typeof User.$inferInsert
