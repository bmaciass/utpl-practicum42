import type { Db } from '@proyecto/db/src/getDBConnection'
import {
  Patient,
  type PatientPayload,
} from '@proyecto/db/src/schema/tables/patient'
import type { PersonCreateInput } from '~/types/person'
import { PatientModel } from '~/models/Patient'
import { PersonModel } from '~/models/Person'
import { eq } from 'drizzle-orm'

export type PatientContactInput = Partial<{ phoneNumbers: string[], emailAddresses: string[] }>

export type PatientCreateInput = PersonCreateInput & PatientContactInput

export type PatientUpdateInput = Partial<PersonCreateInput> &
  Pick<PatientPayload, 'active'> & PatientContactInput

export class PatientService {
  protected db: Db

  constructor(db: Db) {
    this.db = db
  }

  async create(input: PatientCreateInput) {
    const { emailAddresses, phoneNumbers, ...personInput } = input
    const patientModel = await this.db.transaction(async (db) => {
      const personModel = await PersonModel.create(personInput, db)
      const patientModel = await PatientModel.create(personModel, db)
      if (phoneNumbers) {
        await patientModel.setPhoneNumbers(phoneNumbers)
      }
      if (emailAddresses) {
        await patientModel.setEmailAddresses(emailAddresses)
      }
      return patientModel
    })
    return patientModel
  }

  async update(uid: string, input: PatientUpdateInput) {
    const patientModel = await PatientModel.findByUid(uid, this.db)

    if (!patientModel) return null

    await this.db.transaction(async (db) => {}) // FIXME

    const { active, emailAddresses, phoneNumbers, ...personUpdateInput } = input

    await patientModel.update({ active })
    await patientModel.personModel.update(personUpdateInput)

    return patientModel
  }

  async list() {
    const records = await PatientModel.findMany(
      { sql: [eq(Patient.active, true)] },
      this.db,
    )
  }
}
