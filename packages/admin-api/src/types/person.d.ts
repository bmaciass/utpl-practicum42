import type { PatientPayload } from '@proyecto/db/src/schema'

export type PersonCreateInput = Pick<
  PersonPayload,
  'dni' | 'firstName' | 'lastName'
>
