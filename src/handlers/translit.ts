import Context from '../models/Context'
import getRussianLayoutMapping from '../helpers/russianLayoutMapping'

export default async function replaceWithRussianLayout(ctx: Context) {
  if (ctx.message && ctx.message.text) {
    const layoutMapping = getRussianLayoutMapping()
    const message = ctx.message.text
    const resultArray = message
      .split('')
      .map((char) => layoutMapping[char] || char)
    const result = resultArray.join('')
    return await ctx.reply(result)
  }
}
