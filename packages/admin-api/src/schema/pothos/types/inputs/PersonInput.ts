import type { PersonPayload } from '@proyecto/db/src/schema/tables/person'

export type TPersonCreateInput = Pick<
  PersonPayload,
  'dni' | 'firstName' | 'lastName'
>
