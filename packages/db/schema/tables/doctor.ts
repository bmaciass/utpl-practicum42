import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { Staff } from './staff'

export const Doctor = pgTable(
  'Doctor',
  {
    id: serial().primaryKey(),
    staffUid: varchar().references(() => Staff.uid).notNull(),
    createdAt: timestamp({ withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: false })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    active: boolean().default(true).notNull(),
  })

export type PersonPayload = typeof Doctor.$inferInsert
export type PersonRecord = typeof Doctor.$inferSelect

