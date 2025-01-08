import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { Person } from './person'

export const Staff = pgTable(
  'Staff',
  {
    id: serial().primaryKey(),
    uid: varchar({ length: 64 }).unique().notNull(),
    personUid: varchar().references(() => Person.uid).notNull(),
    createdAt: timestamp({ withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: false })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    active: boolean().default(true).notNull(),
  })

export type StaffPayload = typeof Staff.$inferInsert
export type StaffRecord = typeof Staff.$inferSelect

