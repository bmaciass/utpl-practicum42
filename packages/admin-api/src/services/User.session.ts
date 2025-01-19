import type { Db } from '@proyecto/db/src/getDBConnection'
import { Staff, User, type UserRecord } from '@proyecto/db/src/schema'
import { eq } from 'drizzle-orm'
import _ from 'lodash'
import { SessionManager } from '../helpers/session/SessionManager'
import { UserPasswordValidator } from '../helpers/session/UserPasswordValidator'

type LoginMethod = 'password'

type LoginResult =
  | { valid: true; accessToken: string; refreshToken: string }
  | { valid: false; reason: string }

export class UserSession {
  protected db: Db
  protected sessionManager: SessionManager
  constructor(db: Db) {
    this.db = db
    this.sessionManager = new SessionManager()
  }

  async getByUsername(username: string) {
    const result = await this.db
      .select()
      .from(User)
      .fullJoin(Staff, eq(User.personUid, Staff.personUid))
      .where(eq(User.name, username))
      .limit(1)
    if (_.isEmpty(result)) return undefined
    return result[0]
  }

  async getRolesAndPermissions() {
    return {
      roles: [],
      permissions: [],
    }
  }

  protected async verifyUserAndPassword(
    userRecord: UserRecord,
    username: string,
    password: string,
  ) {
    const validator = new UserPasswordValidator({
      password,
      username: username,
    })
    return validator.verifyPassword({
      hash: userRecord.password,
      salt: userRecord.salt,
    })
  }

  async login(data: {
    type: LoginMethod
    username: string
    password: string
  }): Promise<LoginResult> {
    const { username, password } = data
    const result = await this.getByUsername(username)
    if (!result) return { valid: false, reason: 'username not found' }
    const { Staff, User } = result
    if (!Staff || !User) return { valid: false, reason: 'staff not found' }
    const isPasswordValid = await this.verifyUserAndPassword(
      User,
      username,
      password,
    )
    if (!isPasswordValid) return { valid: false, reason: 'invalid password' }

    const { accessToken, refreshToken } = await this.sessionManager.create({
      user: User,
    })

    return {
      valid: true,
      accessToken,
      refreshToken,
    }
  }

  async refresh(data: { refreshToken: string }): Promise<string> {
    const { refreshToken } = data
    const { accessToken } = await this.sessionManager.refresh(refreshToken)
    return accessToken
  }
}
