import type { Db } from '@proyecto/db/src/getDBConnection'
import {
  Patient,
  type PatientPayload,
  type PatientRecord,
} from '@proyecto/db/src/schema/tables/patient'
import { PersonModel } from './Person'
import { eq, type SQL } from 'drizzle-orm'
import { PatientEmailAddress } from '@proyecto/db/src/schema/tables/patientEmailAddress'
import { PatientPhoneNumber } from '@proyecto/db/src/schema/tables/patientPhoneNumber'
import { EmailAddress } from '@proyecto/db/src/schema/tables/emailAddress'
import { PhoneNumber } from '@proyecto/db/src/schema/tables/phoneNumber'
import { compact } from 'lodash'
import { PhoneNumberModel } from './PhoneNumber'
import { EmailAddressModel } from './EmailAddress'

// @ts-ignore: interface/class merging conflicts with subtype instantiation errors
export interface PatientModel<T extends PatientRecord = PatientRecord>
  extends T {}

// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: This is a safe usage of declaration merging
export class PatientModel<T extends PatientRecord = PatientRecord> {
  protected db: Db
  personModel: PersonModel

  constructor(
    data: { record: PatientRecord; personModel: PersonModel },
    db: Db,
  ) {
    const { personModel, record } = data
    Object.assign(this, record)
    this.db = db
    this.personModel = personModel
  }

  async emailAddresses(onlyActive?: boolean) {
    const sql = this.db
      .select({
        emailAddress: EmailAddress.address,
        active: PatientEmailAddress.active,
      })
      .from(PatientEmailAddress)
      .leftJoin(Patient, eq(PatientEmailAddress.patientId, this.id))
      .leftJoin(
        EmailAddress,
        eq(PatientEmailAddress.emailAddressId, EmailAddress.id),
      )
    if (onlyActive) {
      sql.where((fields) => eq(fields.active, true))
    }
    const records = await sql
    return compact(records.map((record) => record.emailAddress))
  }

  async phoneNumbers(onlyActive?: boolean) {
    const sql = this.db
      .select({
        phoneNumber: PhoneNumber.number,
        active: PatientPhoneNumber.active,
      })
      .from(PatientPhoneNumber)
      .leftJoin(Patient, eq(PatientPhoneNumber.patientId, this.id))
      .leftJoin(
        PhoneNumber,
        eq(PatientPhoneNumber.phoneNumberId, PhoneNumber.id),
      )
    if (onlyActive) {
      sql.where((fields) => eq(fields.active, true))
    }
    const records = await sql
    return compact(records.map((record) => record.phoneNumber))
  }

  async setEmailAddresses (emailAddresses: string[]) {
    const emailModels = await EmailAddressModel.createMany(emailAddresses.map((address) => ({ address })), this.db)
    await this.db.insert(PatientEmailAddress).values(emailModels.map((emailModel) => ({ patientId: this.id, emailAddressId: emailModel.id }))).onConflictDoNothing()

    return this
  }

  async setPhoneNumbers (phoneNumbers: string[]) {
    const phoneModels = await PhoneNumberModel.createMany(phoneNumbers.map((phoneNumber) => ({ number: phoneNumber })), this.db)
    await this.db.insert(PatientPhoneNumber).values(phoneModels.map((phoneModel) => ({ patientId: this.id, phoneNumberId: phoneModel.id }))).onConflictDoNothing()

    return this
  }

  async contacts(onlyActive?: boolean) {
    const [emailAddresses, phoneNumbers] = await Promise.all([
      this.emailAddresses(onlyActive),
      this.phoneNumbers(onlyActive),
    ])
    return {
      emailAddresses,
      phoneNumbers,
    }
  }

  async update(data: Pick<PatientPayload, 'active'>) {
    const record = (await this.db.update(Patient).set(data).returning())[0]
    Object.assign(this, record)
    return this
  }

  static async create(personModel: PersonModel, db: Db) {
    const recordToInsert: PatientPayload = {
      personUid: personModel.uid,
    }
    const record = (
      await db.insert(Patient).values(recordToInsert).returning()
    )[0]

    return new PatientModel({ record, personModel }, db)
  }

  static async findByUid(uid: string, db: Db) {
    const record = await db.query.Patient.findFirst({
      where: (fields, { eq }) => eq(fields.personUid, uid),
      with: { person: true },
    })
    if (!record) return null

    return new PatientModel(
      { record, personModel: new PersonModel(record.person, db) },
      db,
    )
  }

  static async findMany(
    data: { sql: SQL<unknown>[]; offset?: number; limit?: number },
    db: Db,
  ) {
    const { sql, limit, offset } = data
    const records = await db.query.Patient.findMany({
      where: (_, { and }) => and(...sql),
      with: { person: true },
      limit,
      offset,
    })
    return records.map(
      (record) =>
        new PatientModel(
          { record, personModel: new PersonModel(record.person, db) },
          db,
        ),
    )
  }
}
