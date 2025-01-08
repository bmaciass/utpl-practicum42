import 'dotenv/config'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { getDBConnection } from './getDBConnection'

async function main() {
  const { db, client } = await getDBConnection()
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: './migrations' })
  await client.end()
}

main()
