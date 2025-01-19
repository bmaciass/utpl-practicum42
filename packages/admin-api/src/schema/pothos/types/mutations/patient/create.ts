import builder from '~/schema/pothos/builder'
import { PatientService } from '~/services/Patient'
import { Patient } from '../../objects/Patient'
import { ResidentMutations } from './root'
import type { TPatientSaveInput, TPatientCreateResponse } from './types'

export const PatientCreateInput = builder
  .inputRef<TPatientSaveInput>('PatientCreateInput')
  .implement({
    fields: (t) => ({
      dni: t.string({ required: true }),
      email: t.string({ required: false }),
      firstName: t.string({ required: true }),
      lastName: t.string({ required: true }),
      name: t.string({ required: true }),
      residenceUid: t.string({ required: true }),
      organizationUid: t.string({ required: true }),
    }),
  })

export const ResidentCreateResponse = builder
  .objectRef<TPatientCreateResponse>('ResidentCreateResponse')
  .implement({
    fields: (t) => ({
      resident: t.expose('resident', { type: Resident }),
    }),
  })

builder.objectField(ResidentMutations, 'create', (t) =>
  t.field({
    type: ResidentCreateResponse,
    args: { data: t.arg({ type: PatientCreateInput, required: true }) },
    authScopes: { admin: true },
    resolve: async (_, { data }, { db }) => {
      const newData = nullsToUndefined<typeof data>(data)
      const { resident } = await create(newData, db)

      return {
        resident,
      }
    },
  }),
)

type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends Date
    ? T
    : {
        [K in keyof T]: T[K] extends (infer U)[]
          ? RecursivelyReplaceNullWithUndefined<U>[]
          : RecursivelyReplaceNullWithUndefined<T[K]>
      }

export function nullsToUndefined<T>(
  obj: T,
): RecursivelyReplaceNullWithUndefined<T> {
  if (obj === null) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return undefined as any
  }

  // object check based on: https://stackoverflow.com/a/51458052/6489012
  if (obj?.constructor.name === 'Object') {
    for (const key in obj) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      obj[key] = nullsToUndefined(obj[key]) as any
    }
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return obj as any
}
