import { getOllamaBaseUrl } from '../helpers/ollamaRuntimeConfig'
import Context from '../models/Context'
import axios from 'axios'
import env from '../helpers/env'

const TELEGRAM_MAX_MESSAGE = 4096

function extractPrompt(messageText: string): string {
  const m = /^\/ollama(?:@\S+)?(?:\s+([\s\S]*))?$/.exec(messageText)
  return (m?.[1] ?? '').trim()
}

export default async function ollama(ctx: Context) {
  const messageText = ctx.message?.text
  if (!messageText) return

  const prompt = extractPrompt(messageText)
  if (!prompt) {
    return ctx.reply(
      'Напиши запрос после команды, например: /ollama Кратко объясни, что такое Ollama'
    )
  }

  const base = getOllamaBaseUrl()
  const url = `${base}/api/chat`

  type OllamaChatResponse = { message?: { content?: string }; error?: string }

  try {
    const res = await axios.post<OllamaChatResponse>(
      url,
      {
        model: env.OLLAMA_MODEL,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      }
    )

    const data = res.data
    if (res.status < 200 || res.status >= 300) {
      return ctx.reply(data.error ?? `HTTP ${res.status}`)
    }

    if (data.error) {
      return ctx.reply(data.error)
    }

    const content = data.message?.content?.trim()
    if (!content) {
      return ctx.reply('Пустой ответ от модели')
    }

    const reply =
      content.length > TELEGRAM_MAX_MESSAGE
        ? `${content.slice(0, TELEGRAM_MAX_MESSAGE - 1)}…`
        : content

    return ctx.reply(reply)
  } catch (e) {
    console.error(e)
    return ctx.reply(
      'Не удалось связаться с Ollama. Проверь OLLAMA_BASE_URL и доступность сервера.'
    )
  }
}
