import Context from '../models/Context'
import getPhoto from '../helpers/Photo'

let motivationInterval: NodeJS.Timer

//TODO: ADD CRON
export default async function autoPhoto(ctx: Context) {
  const photoUrl = getPhoto()
  return await ctx.replyWithPhoto(photoUrl, {
    caption: 'こんにちは',
  })
}

export function stopPhoto() {
  clearInterval(motivationInterval)
}
