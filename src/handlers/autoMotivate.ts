import Context from '../models/Context'
import getMotivationPhoto from '../helpers/motivationPhotos'

let motivationInterval: NodeJS.Timer

export default function autoMotivate(ctx: Context) {
  async function sendPeriodicMessage() {
    if (ctx.chat) {
      const photoUrl = getMotivationPhoto()
      return await ctx.api.sendPhoto(ctx.chat.id, photoUrl)
    }
  }

  // Запуск функции сразу и повторение каждые 5 секунд
  motivationInterval = setInterval(sendPeriodicMessage, 5000)
  return motivationInterval
}

export function stopMotivate() {
  clearInterval(motivationInterval)
}
