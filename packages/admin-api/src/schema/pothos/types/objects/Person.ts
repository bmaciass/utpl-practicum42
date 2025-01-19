import type { PersonRecord } from '@proyecto/db/src/schema/tables/person'
import builder from '../../builder'

export type TPerson = Pick<
  PersonRecord,
  'dni' | 'firstName' | 'lastName' | 'uid'
>

export const PersonInterface = builder
  .interfaceRef<TPerson>('Person')
  .implement({
    fields: (t) => ({
      dni: t.exposeString('dni'),
      firstName: t.exposeString('firstName'),
      lastName: t.exposeString('lastName'),
      uid: t.exposeString('uid'),
    }),
  })
