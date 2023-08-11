import Context from '../models/Context'

export default async function generateRandomNumberInRange(ctx: Context) {
  if (ctx.message && ctx.message.text) {
    let arr: string[]
    try {
      arr = ctx.message.text.split(' ')[1].split('-')
    } catch {
      return await ctx.reply('Нипонял')
    }
    if (arr.length < 2) {
      return await ctx.reply('Нипонял')
    }
    // обработать ошибка когда приходит не число
    const min: number = +arr[0]
    const max: number = +arr[1]
    if (min == max) {
      return await ctx.reply('Ти тупой?')
    }

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    return await ctx.reply(
      `Случайное число в диапазоне от ${min} до ${max}: ${randomNumber}`
    )
  }
}
