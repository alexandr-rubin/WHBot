import Context from '../models/Context'
import ahahahaha from '../helpers/ahaha'

export default async function ahaha(ctx: Context) {
  console.log('AHAHA handler called')
  return await ctx.reply(ahahahaha())
}
