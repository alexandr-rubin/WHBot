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
    const messageText = message.slice(1)
    const result: string[] = []
    for (let i = 0; i < messageText.length; i++) {
      result.push(
        messageText[i]
          .split('')
          .map((char) => layoutMapping[char] || char)
          .join('')
      )
    }
    return await ctx.reply(result.join(' '))
  }
}
