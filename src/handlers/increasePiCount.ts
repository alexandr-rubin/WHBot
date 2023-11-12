import { findOrCreateUser, increasePi } from '../models/User'
import Context from '../models/Context'

export default async function increasePiCount(ctx: Context) {
  if (!ctx.from) {
    throw new Error('No from field found')
  }

  if (ctx.message && ctx.message.text) {
    const userName = ctx.from.username ?? 'noUsername'
    const user = await findOrCreateUser(ctx.from.id, userName)
    if (!user) {
      throw new Error('User not found')
    }

    await increasePi(ctx.message.text.trim())
  }
}
