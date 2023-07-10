import Context from '../models/Context'
import getMotivationPhoto from '../helpers/motivationPhotos'

let motivationInterval: NodeJS.Timeout | null = null
let isMotivating = false

export default function autoMotivate(ctx: Context) {
  if (!isMotivating) {
    isMotivating = true

    motivationInterval = setInterval(async () => {
      const photoUrl = getMotivationPhoto()
      await ctx.replyWithPhoto(photoUrl, {
        caption: 'Работай, ленивый кусок!',
      })
    }, 5000)
  }
}

export function stopMotivate() {
  if (motivationInterval) {
    clearInterval(motivationInterval)
    motivationInterval = null
    isMotivating = false
  }
}
