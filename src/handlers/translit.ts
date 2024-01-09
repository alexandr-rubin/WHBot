import Context from '../models/Context'
import getRussianLayoutMapping from '../helpers/russianLayoutMapping'

export default async function replaceWithRussianLayout(ctx: Context) {
  if (ctx.message && ctx.message.text) {
    const message = ctx.message.text.split(' ')

    // fix
    if (message.length < 2 || message[1].trim() === '') {
      return
    }

    const layoutMapping = getRussianLayoutMapping()
    const messageText = message.slice(1).join('')
    const resultArray = messageText
      .split('')
      .map((char) => layoutMapping[char] || char)
    const result = resultArray.join('')
    return await ctx.reply(result)
  }
}
