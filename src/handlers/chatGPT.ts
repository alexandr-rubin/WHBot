import { CreateCompletionRequest, CreateCompletionResponse } from 'openai'
import Context from '../models/Context'
import openai from '../helpers/openai'

export default async function chatGPT(ctx: Context) {
  if (ctx.message) {
    const message = ctx.message.text

    const completionRequest: CreateCompletionRequest = {
      model: 'gpt-3.5-turbo',
      prompt: message,
      max_tokens: 50,
      temperature: 0,
      n: 1,
      stop: undefined,
    }

    const response = await openai.createCompletion(completionRequest)
    const responseData = response.data as CreateCompletionResponse | undefined
    const reply =
      responseData?.choices?.[0]?.text?.trim() ??
      'No valid response received from the ChatGPT model.'

    return ctx.reply(reply)
  }
}
