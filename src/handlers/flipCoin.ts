import Context from '../models/Context'

export default async function flipCoin(ctx: Context) {
  if (ctx.message) {
    const randomNumber = Math.random() // Генерируем случайное число от 0 до 1
    let result = ''
    if (randomNumber < 0.5) {
      result = 'Heads'
    } else {
      result = 'Tail'
    }

    return await ctx.reply(result)
  }
}
