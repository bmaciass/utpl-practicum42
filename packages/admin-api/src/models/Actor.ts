import type { Db } from '@proyecto/db/src/getDBConnection'
import {
  Actor,
  type ActorPayload,
  type ActorRecord,
} from '@proyecto/db/src/schema/tables/actor'
import { nanoid } from 'nanoid'

// @ts-ignore: interface/class merging conflicts with subtype instantiation errors
export interface ActorModel<T extends ActorRecord = ActorRecord> extends T {}

// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: This is a safe usage of declaration merging
export class ActorModel<T extends ActorRecord = ActorRecord> {
  protected db: Db
  constructor(record: ActorRecord, db: Db) {
    Object.assign(this, record)
    this.db = db
  }

  static async create(db: Db) {
    const recordToInsert: ActorPayload = {
      uid: nanoid(),
    }
    const record = (
      await db.insert(Actor).values(recordToInsert).returning()
    )[0]

    return new ActorModel(record, db)
  }

  static async findByUid(uid: string, db: Db) {
    const record = await db.query.Actor.findFirst({
      where: (fields, { eq }) => eq(fields.uid, uid),
    })
    if (!record) return null

    return new ActorModel(record, db)
  }
}
