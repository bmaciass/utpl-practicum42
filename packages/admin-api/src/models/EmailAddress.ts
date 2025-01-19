import type { Db } from '@proyecto/db/src/getDBConnection'
import {
  EmailAddress,
  type EmailAddressPayload,
  type EmailAddressRecord,
} from '@proyecto/db/src/schema/tables/emailAddress'

// @ts-ignore: interface/class merging conflicts with subtype instantiation errors
export interface EmailAddressModel<
  T extends EmailAddressRecord = EmailAddressRecord,
> extends T {}

// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: This is a safe usage of declaration merging
export class EmailAddressModel<
  T extends EmailAddressRecord = EmailAddressRecord,
> {
  protected db: Db
  constructor(record: EmailAddressRecord, db: Db) {
    Object.assign(this, record)
    this.db = db
  }

  static async create(data: Pick<EmailAddressPayload, 'address'>, db: Db) {
    const record = (await db.insert(EmailAddress).values(data).returning())[0]

    return new EmailAddressModel(record, db)
  }

    static async createMany (data: Array<Pick<EmailAddressPayload, 'address'>>, db: Db) {
      const records = (await db.insert(EmailAddress).values(data).onConflictDoNothing().returning())
      return records.map((record) => new EmailAddressModel(record, db))
    }

  static async findByAddress(address: string, db: Db) {
    const record = await db.query.EmailAddress.findFirst({
      where: (fields, { eq }) => eq(fields.address, address),
    })
    if (!record) return null

    return new EmailAddressModel(record, db)
  }
}
