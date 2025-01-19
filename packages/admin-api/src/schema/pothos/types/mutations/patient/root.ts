import emptyResolver from '~/helpers/emptyResolver'
import builder from '~/schema/pothos/builder'

export const ResidentMutationsRef = builder.objectRef('resident')

export const ResidentMutations = builder.objectType(ResidentMutationsRef, {
  name: 'ResidentMutations',
  description: 'Resident Mutations',
})

builder.mutationField('resident', (t) =>
  t.field({
    resolve: emptyResolver,
    type: ResidentMutationsRef,
    authScopes: { admin: true },
  }),
)
