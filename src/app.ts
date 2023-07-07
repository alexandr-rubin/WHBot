import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { run } from '@grammyjs/runner'
import { webhookCallback } from 'grammy'
import attachUser from '@/middlewares/attachUser'
import autoMotivate, { stopMotivate } from '@/handlers/autoMotivate'
import bot from '@/helpers/bot'
import chatGPT from '@/handlers/chatGPT'
import configureI18n from '@/middlewares/configureI18n'
import handleLanguage from '@/handlers/language'
import i18n from '@/helpers/i18n'
import languageMenu from '@/menus/language'
import motivate from '@/handlers/motivate'
import sendHelp from '@/handlers/help'
import startMongo from '@/helpers/startMongo'

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
  bot.command(['help', 'start'], sendHelp)
  bot.command('language', handleLanguage)
  bot.command('motivate', motivate)
  bot.command('autoMotivationON', autoMotivate)
  bot.command('autoMotivationOFF', stopMotivate)
  // bot.on('message', chatGPT)
  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)
  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()

export default webhookCallback(bot, 'http')
