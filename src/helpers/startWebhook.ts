import bot from './bot'
import express from 'express'

// eslint-disable-next-line import/prefer-default-export
export const webhookApp = express()

webhookApp.use(express.json())

webhookApp.post('/webhook', async (req, res) => {
  // Обработка полученного обновления
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await bot.handleUpdate(req.body)
  res.sendStatus(200)
})
