import { CreateCompletionRequest, CreateCompletionResponse } from 'openai'
import Context from '../models/Context'
import openai from '../helpers/openai'

export default async function goDota(ctx: Context) {
  if (ctx.message) {
    const question = 'Go Dota?'
    const options = ['👍🏻', '👎🏿']
    await ctx.replyWithPoll(question, options, {
      is_anonymous: false,
      allows_multiple_answers: false,
    })
  }
}
