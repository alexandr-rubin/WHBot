import Context from '../models/Context'

export default async function kidala(ctx: Context) {
  if (ctx.message && ctx.chat) {
    if (ctx.message.from.username === 'rubangru') {
      await ctx.api.sendMessage(ctx.chat?.id, '↑ кидала ↑')
    }
  }
}
