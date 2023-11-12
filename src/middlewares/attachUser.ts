import { NextFunction } from 'grammy'
import { findOrCreateUser } from '../models/User'
import Context from '../models/Context'

export default async function attachUser(ctx: Context, next: NextFunction) {
  if (!ctx.from) {
    throw new Error('No from field found')
  }
  const userName = ctx.from.username ?? 'noUsername'
  const user = await findOrCreateUser(ctx.from.id, userName)
  if (!user) {
    throw new Error('User not found')
  }
  ctx.dbuser = user
  return next()
}
