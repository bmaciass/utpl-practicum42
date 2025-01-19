import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { Actor } from './actor'

export const Person = pgTable('Person', {
  id: serial().primaryKey(),
  uid: varchar()
    .references(() => Actor.uid)
    .unique()
    .notNull(),
  dni: varchar({ length: 15 }).unique().notNull(),
  firstName: varchar({ length: 64 }).notNull(),
  lastName: varchar({ length: 64 }).notNull(),
  createdAt: timestamp({ withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: false })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  active: boolean().default(true).notNull(),
})

export type PersonPayload = typeof Person.$inferInsert
export type PersonRecord = typeof Person.$inferSelect
