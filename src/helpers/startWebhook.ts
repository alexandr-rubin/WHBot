import {
  clearOllamaBaseUrlOverride,
  getOllamaBaseUrl,
  setOllamaBaseUrlOverride,
} from './ollamaRuntimeConfig'
import bot from './bot'
import env from './env'
import express from 'express'

// eslint-disable-next-line import/prefer-default-export
export const webhookApp = express()

webhookApp.use(express.json())

function ollamaConfigAuth(req: express.Request): boolean {
  const secret = env.OLLAMA_CONFIG_SECRET
  if (!secret) return false
  const header = req.header('x-ollama-config-secret')
  return header === secret
}

webhookApp.get('/config/ollama-base-url', (req, res) => {
  if (!ollamaConfigAuth(req)) {
    return res
      .status(403)
      .json({ error: 'Forbidden or OLLAMA_CONFIG_SECRET not set' })
  }
  return res.json({ ollamaBaseUrl: getOllamaBaseUrl() })
})

webhookApp.post('/config/ollama-base-url', (req, res) => {
  if (!ollamaConfigAuth(req)) {
    return res
      .status(403)
      .json({ error: 'Forbidden or OLLAMA_CONFIG_SECRET not set' })
  }
  const body = req.body as { ollamaBaseUrl?: string | null }
  if (body.ollamaBaseUrl === null || body.ollamaBaseUrl === undefined) {
    clearOllamaBaseUrlOverride()
    return res.json({ ollamaBaseUrl: getOllamaBaseUrl(), reset: true })
  }
  if (typeof body.ollamaBaseUrl !== 'string') {
    return res
      .status(400)
      .json({ error: 'Expected JSON { ollamaBaseUrl: string | null }' })
  }
  const url = body.ollamaBaseUrl.trim()
  if (url && !/^https?:\/\//i.test(url)) {
    return res
      .status(400)
      .json({ error: 'ollamaBaseUrl must start with http:// or https://' })
  }
  if (!url) {
    clearOllamaBaseUrlOverride()
    return res.json({ ollamaBaseUrl: getOllamaBaseUrl(), reset: true })
  }
  setOllamaBaseUrlOverride(url)
  return res.json({ ollamaBaseUrl: getOllamaBaseUrl() })
})

webhookApp.post('/webhook', async (req, res) => {
  // Обработка полученного обновления
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await bot.handleUpdate(req.body)
  res.sendStatus(200)
})
