import Context from '../models/Context'
import openai from '../helpers/openai'

export default async function chatGPT(ctx: Context) {
  if (ctx.message) {
    const message = ctx.message.text

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message ?? 'hello' }],
      max_tokens: 50,
    })

    const responseMessage: string | null =
      chatCompletion.choices[0].message.content

    return ctx.reply(responseMessage ?? 'no response :(')
  }
}
