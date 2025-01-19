import type { PatientRecord } from '@proyecto/db/src/schema/tables/patient'
import builder from '../../builder'
import { PersonInterface } from './Person'

export type TPatient = Pick<PatientRecord, 'personUid'>

export const Patient = builder
  .objectRef<TPatient>('Vehicle')
  .implement({
    fields: (t) => ({
      personUid: t.exposeString('personUid'),
    }),
  })
  .addInterfaces([PersonInterface])
