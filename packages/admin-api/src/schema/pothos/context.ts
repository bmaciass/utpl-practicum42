import { Db, Client } from '@proyecto/db/src/getDBConnection'
import { JWTAccessTokenPayload } from '~/helpers/session/types'

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type AppContext = {
  db: Db
  client: Client
  token?: JWTAccessTokenPayload
}
