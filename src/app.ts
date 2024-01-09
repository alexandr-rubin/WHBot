import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { webhookApp } from './helpers/startWebhook'
import ahaha from './handlers/AHAHA'
import attachUser from './middlewares/attachUser'
import autoPhoto, { stopPhoto } from './handlers/autoPhotos'
import bot from './helpers/bot'
import chatGPT from './handlers/chatGPT'
import configureI18n from './middlewares/configureI18n'
import flipCoin from './handlers/flipCoin'
import generateRandomNumberInRange from './handlers/randomNumber'
import goDota from './handlers/goDota'
import handleHelp from './handlers/help'
import handleLanguage from './handlers/language'
import i18n from './helpers/i18n'
import ignoreOldMessageUpdates from './middlewares/ignoreOldMessageUpdates'
import increasePiCount from './handlers/increasePiCount'
import languageMenu from './menus/language'
import mobilization from './handlers/mobilization'
import replaceWithRussianLayout from './handlers/translit'
import sendVideo from './handlers/motivate'
import startMongo from './helpers/startMongo'
import stikerDrop from './handlers/stikerDrop'

async function runApp() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')
  bot
    // Middlewares
    .use(ignoreOldMessageUpdates)
    .use(sequentialize())
    .use(ignoreOld())
    .use(attachUser)
    .use(i18n.middleware())
    .use(configureI18n)
    // Menus
    .use(languageMenu)
  // Commands
  bot.command(['help', 'start'], handleHelp)
  bot.command('chatgpt', chatGPT)
  bot.command('language', handleLanguage)
  bot.command('video', sendVideo)
  bot.command('photo', autoPhoto)
  bot.command('stopBuriatki', stopPhoto)
  bot.command('godota', goDota)
  bot.command('flipcoin', flipCoin)
  bot.command('mobilization', mobilization)
  bot.command('ahaha', ahaha)
  bot.command('random', generateRandomNumberInRange)
  bot.command('pi', increasePiCount)
  bot.command('engtranslit', replaceWithRussianLayout)
  //TODO: ADD BAN STICKER COMMAND
  bot.on(':sticker', stikerDrop)
  // Errors
  bot.catch(console.error)
  await bot.init()
  console.info(`Bot ${bot.botInfo.username} is up and running`)
  webhookApp.listen(4242, () => console.log('Running on port 4242'))
}

// TODO: add vercel req limiter
void runApp()
