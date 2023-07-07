import Context from '@/models/Context'
import getMotivationPhoto from '@/helpers/motivationPhotos'

let motivationInterval: NodeJS.Timer

export default function autoMotivate(ctx: Context) {
  async function sendPeriodicMessage() {
    const photoUrl = getMotivationPhoto()
    return await ctx.replyWithPhoto(photoUrl, {
      caption: 'Работай, ленивый кусок!',
    })
  }

  // Запустите функцию каждые 5 секунд
  motivationInterval = setInterval(sendPeriodicMessage, 5000)
}

export function stopMotivate() {
  clearInterval(motivationInterval)
}
