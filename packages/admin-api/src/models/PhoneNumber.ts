import type { Db } from '@proyecto/db/src/getDBConnection'
import {
  PhoneNumber,
  type PhoneNumberPayload,
  type PhoneNumberRecord,
} from '@proyecto/db/src/schema/tables/phoneNumber'

// @ts-ignore: interface/class merging conflicts with subtype instantiation errors
export interface PhoneNumberModel<
  T extends PhoneNumberRecord = PhoneNumberRecord,
> extends T {}

// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: This is a safe usage of declaration merging
export class PhoneNumberModel<T extends PhoneNumberRecord = PhoneNumberRecord> {
  protected db: Db
  constructor(record: PhoneNumberRecord, db: Db) {
    Object.assign(this, record)
    this.db = db
  }

  static async create(data: Pick<PhoneNumberPayload, 'number'>, db: Db) {
    const record = (await db.insert(PhoneNumber).values(data).onConflictDoNothing().returning())[0]

    return new PhoneNumberModel(record, db)
  }

  static async createMany (data: Array<Pick<PhoneNumberPayload, 'number'>>, db: Db) {
    const records = (await db.insert(PhoneNumber).values(data).onConflictDoNothing().returning())
    return records.map((record) => new PhoneNumberModel(record, db))
  }

  static async findByNumber(number: string, db: Db) {
    const record = await db.query.PhoneNumber.findFirst({
      where: (fields, { eq }) => eq(fields.number, number),
    })
    if (!record) return null

    return new PhoneNumberModel(record, db)
  }
}
