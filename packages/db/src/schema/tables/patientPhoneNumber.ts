import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { Patient } from './patient'
import { PhoneNumber } from './phoneNumber'

export const PatientPhoneNumber = pgTable(
  'PatientPhoneNumber',
  {
    patientId: integer()
      .references(() => Patient.id)
      .unique()
      .notNull(),
    phoneNumberId: integer().references(() => PhoneNumber.id),
    active: boolean().default(true).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.patientId, table.phoneNumberId] }),
  }),
)

export type PatientPhoneNumberPayload = typeof PatientPhoneNumber.$inferInsert
export type PatientPhoneNumberRecord = typeof PatientPhoneNumber.$inferSelect
