import { CreateCompletionRequest, CreateCompletionResponse } from 'openai'
import Context from '../models/Context'
import openai from '../helpers/openai'

export default async function stikerDrop(ctx: Context) {
  if (ctx.message && ctx.message.sticker && ctx.chat) {
    const messageId = ctx.message.message_id
    if (ctx.message.sticker.set_name === 'monke2004') {
      await ctx.api.deleteMessage(ctx.chat.id, messageId)
      await ctx.api.sendMessage(ctx.chat?.id, 'Макаки сасат')
    }
  }
}
