import type { Db } from '@proyecto/db/src/getDBConnection'
import {
  Person,
  type PersonPayload,
  type PersonRecord,
} from '@proyecto/db/src/schema/tables/person'
import { eq } from 'drizzle-orm'
import { ActorModel } from './Actor'

// @ts-ignore: interface/class merging conflicts with subtype instantiation errors
export interface PersonModel<T extends PersonRecord = PersonRecord> extends T {}

// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: This is a safe usage of declaration merging
export class PersonModel<T extends PersonRecord = PersonRecord> {
  protected db: Db
  constructor(record: PersonRecord, db: Db) {
    Object.assign(this, record)
    this.db = db
  }

  async update(
    data: Partial<Pick<PersonPayload, 'firstName' | 'lastName' | 'dni'>>,
  ) {
    const result = (
      await this.db
        .update(Person)
        .set(data)
        .where(eq(Person.id, this.id))
        .returning()
    )[0]

    Object.assign(this, result)
    return this
  }

  static async create(
    data: Pick<PersonPayload, 'dni' | 'firstName' | 'lastName'>,
    db: Db,
  ) {
    const personRecord = await db.transaction(async (tx) => {
      const actorRecord = await ActorModel.create(tx)
      const recordToInsert: PersonPayload = {
        ...data,
        uid: actorRecord.uid,
      }
      const record = (
        await db.insert(Person).values(recordToInsert).returning()
      )[0]
      return record
    })

    return new PersonModel(personRecord, db)
  }

  static async findByUid(uid: string, db: Db) {
    const record = await db.query.Person.findFirst({
      where: (fields, { eq }) => eq(fields.uid, uid),
    })
    if (!record) return null

    return new PersonModel(record, db)
  }

  static async findByDni(dni: string, db: Db) {
    const record = await db.query.Person.findFirst({
      where: (fields, { eq }) => eq(fields.dni, dni),
    })
    if (!record) return null

    return new PersonModel(record, db)
  }

  static async findManyByName(name: string, db: Db) {
    const records = await db.query.Person.findMany({
      where: (fields, { ilike, or }) =>
        or(ilike(fields.firstName, name), ilike(fields.lastName, name)),
    })

    return records.map((record) => new PersonModel(record, db))
  }
}
