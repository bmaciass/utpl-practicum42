import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

export const EmailAddress = pgTable('EmailAddress', {
  id: serial().primaryKey(),
  address: varchar().unique().notNull(),
  createdAt: timestamp({ withTimezone: false }).defaultNow().notNull(),
})

export type EmailAddressPayload = typeof EmailAddress.$inferInsert
export type EmailAddressRecord = typeof EmailAddress.$inferSelect
