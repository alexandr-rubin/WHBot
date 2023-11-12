import { increasePi } from '../models/User'
import Context from '../models/Context'

export default async function increasePiCount(ctx: Context) {
  if (ctx.message && ctx.message.text) {
    console.log(ctx.message.text)
    await increasePi(ctx.message.text)
    return await ctx.reply(ctx.message.text)
  }
}
