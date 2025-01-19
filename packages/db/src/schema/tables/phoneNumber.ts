import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

export const PhoneNumber = pgTable('PhoneNumber', {
  id: serial().primaryKey(),
  number: varchar().unique().notNull(),
  createdAt: timestamp({ withTimezone: false }).defaultNow().notNull(),
})

export type PhoneNumberPayload = typeof PhoneNumber.$inferInsert
export type PhoneNumberRecord = typeof PhoneNumber.$inferSelect
