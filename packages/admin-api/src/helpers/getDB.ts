import { getDBConnection } from '@proyecto/db/src/getDBConnection'
import { getDatabaseURL } from '~/config/env'

export async function getDB() {
  const { db, client } = await getDBConnection(getDatabaseURL())
  return { db, client }
}
