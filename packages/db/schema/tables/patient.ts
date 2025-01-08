import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { Person } from './person'

export const Patient = pgTable(
  'Patient',
  {
    id: serial().primaryKey(),
    personUid: varchar().references(() => Person.uid).notNull(),
    createdAt: timestamp({ withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: false })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    active: boolean().default(true).notNull(),
  })

export type PersonPayload = typeof Patient.$inferInsert
export type PersonRecord = typeof Patient.$inferSelect

