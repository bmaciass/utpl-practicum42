import type { Db } from '@proyecto/db/src/getDBConnection'
import {
  Staff,
  type StaffPayload,
  type StaffType,
} from '@proyecto/db/src/schema/tables/staff'
import type { PersonCreateInput } from '~/types/person'
import { eq } from 'drizzle-orm'
import { StaffModel } from '~/models/Staff'
import { PersonModel } from '~/models/Person'

export type StaffCreateInput = Pick<StaffPayload, 'type'> & PersonCreateInput
export type StaffUpdateInput = Partial<PersonCreateInput> &
  Pick<StaffPayload, 'active'>

export class StaffService {
  protected db: Db

  constructor(db: Db) {
    this.db = db
  }

  async create(input: StaffCreateInput) {
    const { type, ...personInput } = input
    const personModel = await PersonModel.create(personInput, this.db)
    const staffModel = await StaffModel.create({ personModel, type }, this.db)

    return staffModel
  }

  async update(uid: string, input: StaffUpdateInput) {
    const staffModel = await StaffModel.findByUid(uid, this.db)

    if (!staffModel) return null

    const { active, ...personUpdateInput } = input

    await staffModel.update({ active })
    await staffModel.personModel.update(personUpdateInput)

    return staffModel
  }

  async list(type: StaffType) {
    const records = await StaffModel.findMany(
      { sql: [eq(Staff.type, type)] },
      this.db,
    )
  }
}
