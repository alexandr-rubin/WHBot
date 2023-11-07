import OpenAI from 'openai'
import env from '../helpers/env'

const openaiApiKey = env.OPENAI_API_KEY

const openai = new OpenAI({
  apiKey: openaiApiKey,
})

export default openai
