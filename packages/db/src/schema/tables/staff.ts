import {
  boolean,
  index,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { Person } from './person'
import { relations } from 'drizzle-orm'

export const staffTypesEnum = pgEnum('staffType', ['doctor', 'nurse'])

export const Staff = pgTable(
  'Staff',
  {
    id: serial().primaryKey(),
    type: staffTypesEnum().notNull(),
    personUid: varchar()
      .references(() => Person.uid)
      .unique()
      .notNull(),
    createdAt: timestamp({ withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: false })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    active: boolean().default(true).notNull(),
  },
  (table) => ({
    type_idx: index('type_idx').on(table.type),
  }),
)

export const staffRelations = relations(Staff, ({ one }) => ({
  person: one(Person, {
    fields: [Staff.personUid],
    references: [Person.uid],
  }),
}))

export type StaffPayload = typeof Staff.$inferInsert
export type StaffRecord = typeof Staff.$inferSelect
export const StaffTypes = [...staffTypesEnum.enumValues] as const
export type StaffType = (typeof StaffTypes)[number]
