import builder from '~/schema/pothos/builder'
import { update } from '~/services/Patient'
import { Resident } from '../../objects/Resident'
import { ResidentMutations } from './root'
import type {
  TPatientUpdateDataInput,
  TPatientUpdateResponse,
  TPatientUpdateWhereInput,
} from './types'

export const ResidentUpdateWhereInput = builder
  .inputRef<TPatientUpdateWhereInput>('ResidentUpdateWhereInput')
  .implement({
    fields: (t) => ({
      uid: t.string({ required: true }),
    }),
  })

export const ResidentUpdateDataInput = builder
  .inputRef<TPatientUpdateDataInput>('ResidentUpdateDataInput')
  .implement({
    fields: (t) => ({
      name: t.string({ required: false }),
      active: t.boolean({ required: false }),
    }),
  })

export const ResidentUpdateResponse = builder
  .objectRef<TPatientUpdateResponse>('ResidentUpdateResponse')
  .implement({
    fields: (t) => ({
      resident: t.expose('resident', { type: Resident }),
    }),
  })

builder.objectField(ResidentMutations, 'update', (t) =>
  t.field({
    type: ResidentUpdateResponse,
    args: {
      data: t.arg({ type: ResidentUpdateDataInput, required: true }),
      where: t.arg({ type: ResidentUpdateWhereInput, required: true }),
    },
    authScopes: { admin: true },
    resolve: async (_, { data, where }, { db }) => {
      const newData = nullsToUndefined<typeof data>(data)
      const { resident } = await update({ data: newData, where }, db)

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
