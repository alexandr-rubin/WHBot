import Context from '../models/Context'
import getMotivationPhoto from '../helpers/motivationPhotos'

let motivationInterval: NodeJS.Timer

export default async function autoMotivate(ctx: Context) {
  const photoUrl = getMotivationPhoto()
  return await ctx.replyWithPhoto(photoUrl, {
    caption: 'こんにちは',
  })

  // Запуск функции сразу и повторение каждые 5 секунд
  // void sendPeriodicMessage()
  // motivationInterval = setInterval(sendPeriodicMessage, 5000)
}

export function stopMotivate() {
  clearInterval(motivationInterval)
}
