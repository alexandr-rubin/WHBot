import { Configuration, OpenAIApi } from 'openai'
import env from '../helpers/env'

const openaiApiKey = env.OPENAI_API_KEY

const openaiConfig = new Configuration({
  apiKey: openaiApiKey,
})

const openai = new OpenAIApi(openaiConfig)

export default openai
