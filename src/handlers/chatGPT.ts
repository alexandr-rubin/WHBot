import Context from '../models/Context'
import OpenAI from 'openai'
import openai from '../helpers/openai'

export default async function chatGPT(ctx: Context) {
  if (ctx.message) {
    const message = ctx.message.text

    try {
      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message ?? 'hello' }],
        max_tokens: 50,
      })

      const responseMessage: string | null =
        chatCompletion.choices[0].message.content

      return ctx.reply(responseMessage ?? 'no response :(')
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        console.error(error.status) // e.g. 401
        console.error(error.message) // e.g. The authentication token you passed was invalid...
        console.error(error.code) // e.g. 'invalid_api_key'
        console.error(error.type) // e.g. 'invalid_request_error'
        return ctx.reply(error.message)
      } else {
        // Non-API error
        console.log(error)
        return ctx.reply('Non-API error')
      }
    }
  }
}
