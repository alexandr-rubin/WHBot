import Context from '../models/Context'

export default async function generateRandomNumberInRange(ctx: Context) {
  if (ctx.message && ctx.message.text) {
    const arr = ctx.message.text.split('-')
    if (arr.length < 2) {
      return await ctx.reply('Нипонял')
    }
    // обработать ошибка когда приходит не число
    const min: number = +arr[0]
    const max: number = +arr[1]
    if (min >= max) {
      return await ctx.reply(
        'Минимальное значение должно быть меньше максимального.'
      )
    }

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    return await ctx.reply(
      `Случайное число в диапазоне от ${min} до ${max}: ${randomNumber}`
    )
  }
}
