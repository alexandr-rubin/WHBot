import { webhookCallback } from 'grammy'
import bot from './bot'
import express from 'express'

// eslint-disable-next-line import/prefer-default-export
export const webhookApp = express()

webhookApp.use(express.json())

webhookApp.post(
  '/bot5855393087:AAElgj0uMwt3llKcLZuWwR5aDjYxNim88_M',
  async (req, res) => {
    const update = req.body
    // Обработка полученного обновления
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await bot.handleUpdate(update)
    res.sendStatus(200)
  }
)
