import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { Person } from './person'
import { relations } from 'drizzle-orm'

export const Patient = pgTable('Patient', {
  id: serial().primaryKey(),
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
})

export const patientRelations = relations(Patient, ({ one }) => ({
  person: one(Person, {
    fields: [Patient.personUid],
    references: [Person.uid],
  }),
}))

export type PatientPayload = typeof Patient.$inferInsert
export type PatientRecord = typeof Patient.$inferSelect
