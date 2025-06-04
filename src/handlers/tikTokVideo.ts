import { InputFile } from 'grammy'
import { InputMediaPhoto } from 'grammy/types'
import Context from '../models/Context'
import axios from 'axios'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_MEDIA_GROUP_SIZE = 10

async function safeSendMessage(ctx: Context, text: string) {
  try {
    await ctx.api.sendMessage(ctx.chat!.id, text)
  } catch (e) {
    console.error('Failed to send message:', e)
  }
}

// TODO: FIX
async function downloadImage(url: string): Promise<InputFile | null> {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' })
    const contentType = res.headers['content-type'] || ''
    if (!contentType.startsWith('image')) {
      console.error(`Invalid content-type for image ${url}: ${contentType}`)
      return null
    }
    const contentLength = res.headers['content-length']
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      console.error(`Image too large: ${url}, size: ${contentLength}`)
      return null
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const buffer = Buffer.from(res.data)
    return new InputFile(buffer, `image-${Date.now()}.jpg`)
  } catch (err) {
    console.error(`Error downloading image ${url}:`, err)
    return null
  }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export default async function tikTokVideo(ctx: Context) {
  const text = ctx.message?.text || ''
  if (!ctx.chat) {
    console.error('No chat context available')
    return
  }
  if (!text.includes('tiktok.com')) {
    console.log('No TikTok link found in message:', text)
    return
  }

  await safeSendMessage(ctx, '⏳ Please wait, fetching content...')

  const reqvideourl =
    'https://www.tikwm.com/api/?url=' + encodeURIComponent(text) + '&hd=1'

  try {
    const response = await axios.get(reqvideourl)
    const data = response.data as {
      code: number
      data: {
        type?: number
        play?: string
        music?: string
        images?: string[]
      }
      msg: string
    }

    console.log('API response:', JSON.stringify(data, null, 2))

    if (data.code !== 0) {
      await safeSendMessage(ctx, '❌ ' + data.msg)
      return
    }

    const { type, play, images, music } = data.data

    const isSlideshow =
      type === 1 ||
      text.includes('/photo/') ||
      text.includes('aweme_type=150') ||
      (images && images.length > 0 && (!play || play === music))
    const isImageSet = images && images.length > 0
    const hasVideo = !!play && play !== music
    const hasMusic = !!music

    if (isSlideshow && isImageSet) {
      const downloads = await Promise.all(images!.map(downloadImage))
      const validMedia: InputMediaPhoto[] = downloads
        .map((file, idx) =>
          file
            ? {
                type: 'photo',
                media: file,
                ...(idx === 0 ? { caption: '🖼 TikTok slideshow:' } : {}),
              }
            : null
        )
        .filter(Boolean) as InputMediaPhoto[]

      if (validMedia.length === 0) {
        await safeSendMessage(
          ctx,
          '❌ Could not download any valid slideshow images.'
        )
        return
      }

      const chunks = chunkArray(validMedia, MAX_MEDIA_GROUP_SIZE)
      for (const chunk of chunks) {
        try {
          await ctx.api.sendMediaGroup(ctx.chat.id, chunk)
        } catch (err) {
          console.error('Error sending media group:', err)
          await safeSendMessage(ctx, '❌ Error sending slideshow images.')
        }
      }

      if (hasMusic) {
        try {
          await ctx.api.sendAudio(ctx.chat.id, music!, {
            caption: '🎵 Audio from TikTok slideshow',
          })
        } catch (err) {
          console.error('Error sending audio:', err)
          await safeSendMessage(ctx, '❌ Error sending slideshow audio.')
        }
      }

      return
    }

    if (hasVideo) {
      try {
        const headRes = await axios.head(play!)
        const contentType = headRes.headers['content-type'] || ''
        if (!contentType.startsWith('video')) {
          await safeSendMessage(ctx, '❌ Content is not a video.')
          return
        }
        await ctx.api.sendVideo(ctx.chat.id, play!, {
          caption: '📹 Here is your TikTok video!',
        })
        if (hasMusic) {
          await ctx.api.sendAudio(ctx.chat.id, music!, {
            caption: '🎵 Background music',
          })
        }
      } catch (err) {
        console.error('Error sending video:', err)
        await safeSendMessage(ctx, '❌ Error sending TikTok video.')
      }
      return
    }

    if (hasMusic) {
      try {
        await ctx.api.sendAudio(ctx.chat.id, music!, {
          caption: '🎧 TikTok audio',
        })
      } catch (err) {
        console.error('Error sending audio:', err)
        await safeSendMessage(ctx, '❌ Error sending TikTok audio.')
      }
      return
    }

    await safeSendMessage(ctx, '❌ Unsupported content format.')
  } catch (error) {
    console.error('Error fetching TikTok content:', error)
    await safeSendMessage(
      ctx,
      '❌ An error occurred while fetching the TikTok content.'
    )
  }
}
