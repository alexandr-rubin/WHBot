import * as dotenv from 'dotenv'
import { cleanEnv, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  TOKEN: str(),
  MONGO: str(),
  MONGOLOCAL: str(),
  OPENAI_API_KEY: str(),
  OLLAMA_BASE_URL: str({ default: 'http://127.0.0.1:11434' }),
  OLLAMA_MODEL: str({ default: 'llama3.2' }),
  /** Секрет для POST/GET /config/ollama-base-url; пусто — эндпоинты отключены */
  OLLAMA_CONFIG_SECRET: str({ default: 'qwerty' }),
})
