import Context from '../models/Context'

export default async function flipCoin(ctx: Context) {
  if (ctx.message) {
    const randomNumber = Math.random()
    let result = ''
    if (randomNumber < 0.5) {
      result = 'Heads'
    } else {
      result = 'Tail'
    }

    return await ctx.reply(result)
  }
}
