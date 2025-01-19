import { boolean, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { Patient } from './patient'
import { EmailAddress } from './emailAddress'

export const PatientEmailAddress = pgTable(
  'PatientEmailAddress',
  {
    patientId: integer()
      .references(() => Patient.id)
      .unique()
      .notNull(),
    emailAddressId: integer().references(() => EmailAddress.id),
    active: boolean().default(true).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.patientId, table.emailAddressId] }),
  }),
)

export type PatientEmailAddressPayload = typeof PatientEmailAddress.$inferInsert
export type PatientEmailAddressRecord = typeof PatientEmailAddress.$inferSelect
