import { writeFileSync } from 'node:fs'
import { lexicographicSortSchema, printSchema } from 'graphql'
import schema from '~/schema/pothos'

const schemaAsString = printSchema(lexicographicSortSchema(schema))

writeFileSync(
  `${__dirname}/../../../../schema/admin-api/schema.graphql`,
  schemaAsString,
)
