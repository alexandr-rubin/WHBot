import * as express from 'express'
import { Message } from 'grammy/types'
import bot from '@/helpers/bot'

// eslint-disable-next-line import/prefer-default-export
export const webhookApp = express()

webhookApp.use(express.json())

webhookApp.post('/', (req, res) => {
  res.send('sukahello')
})
