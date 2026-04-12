import env from './env'

let ollamaBaseUrlOverride: string | null = null

export function getOllamaBaseUrl(): string {
  const raw = ollamaBaseUrlOverride ?? env.OLLAMA_BASE_URL
  return raw.replace(/\/$/, '')
}

export function setOllamaBaseUrlOverride(url: string): void {
  const t = url.trim()
  if (!t) {
    ollamaBaseUrlOverride = null
    return
  }
  ollamaBaseUrlOverride = t.replace(/\/$/, '')
}

export function clearOllamaBaseUrlOverride(): void {
  ollamaBaseUrlOverride = null
}
