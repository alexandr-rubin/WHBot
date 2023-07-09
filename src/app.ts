import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { Message } from 'grammy/types'
import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { run } from '@grammyjs/runner'
import { webhookApp } from './helpers/startWebhook'
import { webhookCallback } from 'grammy'
import attachUser from './middlewares/attachUser'
import autoMotivate, { stopMotivate } from './handlers/autoMotivate'
import bot from './helpers/bot'
import configureI18n from './middlewares/configureI18n'
import handleHelp from './handlers/help'
import handleLanguage from './handlers/language'
import i18n from './helpers/i18n'
import languageMenu from './menus/language'
import motivate from './handlers/motivate'
import startMongo from './helpers/startMongo'

async function runApp() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')
  bot
    // Middlewares
    .use(sequentialize())
    .use(ignoreOld())
    .use(attachUser)
    .use(i18n.middleware())
    .use(configureI18n)
    // Menus
    .use(languageMenu)
  // Commands
  bot.command(['help', 'start'], handleHelp)
  bot.command('language', handleLanguage)
  bot.command('motivate', motivate)
  bot.command('autoMotivationON', autoMotivate)
  bot.command('autoMotivationOFF', stopMotivate)
  // bot.on('message', chatGPT)
  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  // // Удаление активного вебхука
  // await bot.api.deleteWebhook()

  // // Получение обновлений через метод getUpdates
  // const updates = await bot.api.getUpdates()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
  webhookApp.use(webhookCallback(bot, 'express'))

  // webhookApp.post('/webhook', async (req, res) => {
  //   const { body } = req
  //   // Проверка, является ли входящий запрос от Telegram
  //   if (!body || !body.message) {
  //     res.sendStatus(200)
  //     return
  //   }

  //   // Извлечение информации из входящего сообщения
  //   const message: Message = body.message
  //   const chatId = message.chat.id
  //   const text = message.text

  //   // Обработка команд от пользователя
  //   if (text === '/start') {
  //     await bot.api.sendMessage(chatId, 'Привет! Добро пожаловать!')
  //   } else if (text === '/help') {
  //     await bot.api.sendMessage(chatId, 'Нужна помощь?')
  //   } else {
  //     await bot.api.sendMessage(
  //       chatId,
  //       'Неизвестная команда. Попробуйте ещё раз.'
  //     )
  //   }

  //   res.sendStatus(200)
  // })

  webhookApp.listen(4242, () => console.log('Running on port 4242'))
}

void runApp()
