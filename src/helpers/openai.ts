import { Configuration, OpenAIApi } from 'openai'
import env from '@/helpers/env'

const openaiApiKey = env.OPENAIAPIKEY

const openaiConfig = new Configuration({
  apiKey: openaiApiKey,
})

const openai = new OpenAIApi(openaiConfig)
export default openai
