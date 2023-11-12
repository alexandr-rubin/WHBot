import { increasePi } from '../models/User'
import Context from '../models/Context'

export default async function increasePiCount(ctx: Context) {
  if (ctx.message && ctx.message.text) {
    await increasePi(ctx.message.text)
  }
}
