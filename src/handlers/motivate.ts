import Context from '@/models/Context'
import getMotivationPhoto from '@/helpers/motivationPhotos'

export default async function motivate(ctx: Context) {
  const photoUrl = getMotivationPhoto()
  return await ctx.replyWithPhoto(photoUrl, {
    caption: 'Привет, это моя фотография!',
  })
}
