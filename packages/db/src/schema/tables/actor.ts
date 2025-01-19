import { pgEnum, pgTable, serial, varchar } from 'drizzle-orm/pg-core'

// This table is useful for identifying actions performed on record, auditing and logs
export const Actor = pgTable('Actor', {
  id: serial().primaryKey(),
  uid: varchar({ length: 64 }).unique().notNull(),
})

export type ActorRecord = typeof Actor.$inferSelect
export type ActorPayload = typeof Actor.$inferInsert
