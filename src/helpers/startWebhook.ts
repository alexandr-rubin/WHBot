import { webhookCallback } from 'grammy'
import bot from './bot'
import express from 'express'

// eslint-disable-next-line import/prefer-default-export
export const webhookApp = express()

webhookApp.use(express.json())
webhookApp.use(webhookCallback(bot, 'express'))

webhookApp.post('/', (req, res) => {
  res.send('hello suk')
})
