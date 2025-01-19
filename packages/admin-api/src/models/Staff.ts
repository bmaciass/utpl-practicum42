import type { Db } from '@proyecto/db/src/getDBConnection'
import {
  Staff,
  type StaffType,
  type StaffPayload,
  type StaffRecord,
} from '@proyecto/db/src/schema/tables/staff'
import { PersonModel } from './Person'
import type { SQL } from 'drizzle-orm'

// @ts-ignore: interface/class merging conflicts with subtype instantiation errors
export interface StaffModel<T extends StaffRecord = StaffRecord> extends T {}

// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: This is a safe usage of declaration merging
export class StaffModel<T extends StaffRecord = StaffRecord> {
  protected db: Db
  personModel: PersonModel
  // type: StaffType

  constructor(data: { record: StaffRecord; personModel: PersonModel }, db: Db) {
    const { personModel, record } = data
    Object.assign(this, record)
    this.db = db
    // this.type = type
    this.personModel = personModel
  }

  async update(data: Pick<StaffPayload, 'active'>) {
    const record = (await this.db.update(Staff).set(data).returning())[0]
    Object.assign(this, record)
    return this
  }

  static async create(
    data: { type: StaffType; personModel: PersonModel },
    db: Db,
  ) {
    const { personModel, type } = data
    const recordToInsert: StaffPayload = {
      personUid: personModel.uid,
      type,
    }
    const record = (
      await db.insert(Staff).values(recordToInsert).returning()
    )[0]

    return new StaffModel({ personModel, record }, db)
  }

  static async findByUid(uid: string, db: Db) {
    const record = await db.query.Staff.findFirst({
      where: (fields, { eq }) => eq(fields.personUid, uid),
      with: { person: true },
    })
    if (!record) return null

    return new StaffModel(
      { personModel: new PersonModel(record.person, db), record },
      db,
    )
  }

  static async findMany(
    data: { sql: SQL<unknown>[]; offset?: number; limit?: number },
    db: Db,
  ) {
    const { sql, limit, offset } = data
    const records = await db.query.Staff.findMany({
      where: (_, { and }) => and(...sql),
      with: { person: true },
      offset,
      limit,
    })
    return records.map(
      (record) =>
        new StaffModel(
          { record, personModel: new PersonModel(record.person, db) },
          db,
        ),
    )
  }
}
export abstract class StaffAdapter {
  abstract list(): Promise<StaffRecord[]>
}
