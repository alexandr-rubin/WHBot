import Context from '../models/Context'

export default async function kidala(ctx: Context) {
  if (ctx.message && ctx.chat) {
    if (ctx.message.from.username === 'fluttafy') {
      await ctx.api.sendMessage(ctx.chat?.id, '↑ кидала ↑')
    }
  }
}
