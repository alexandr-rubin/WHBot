import express from 'express'

// eslint-disable-next-line import/prefer-default-export
export const webhookApp = express()

webhookApp.use(express.json())

webhookApp.post('/', (req, res) => {
  res.send('sukahello')
})
