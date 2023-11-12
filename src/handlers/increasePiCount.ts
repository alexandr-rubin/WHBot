import { increasePi } from '../models/User'
import Context from '../models/Context'

export default async function increasePiCount(ctx: Context) {
  if (ctx.message && ctx.message.text) {
    const login = ctx.message.text.split(' ')
    const user = await increasePi(login[1])
    if (user) {
      return await ctx.reply('vi napizdeli uje ' + user.piCount + ' raz(a)')
    }
    return await ctx.reply('takogo pizdabola netu')
  }
}
