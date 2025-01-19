import type { PatientPayload, PersonPayload } from '@proyecto/db/src/schema'
import type { TPatient } from '../../objects/Patient'
import type { PatientCreateInput } from '~/services/Patient'

export type TPatientCreateResponse = {
  patient: TPatient
}

export type TPatientUpdateWhereInput = Pick<PatientPayload, 'personUid'>

export type TPatientUpdateDataInput = Partial<
  Pick<PatientPayload, 'active'> & PatientCreateInput
>

export type TPatientUpdateResponse = {
  patient: TPatient
}
