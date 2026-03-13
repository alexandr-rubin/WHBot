import { InputFile } from 'grammy'
import { InputMediaPhoto } from 'grammy/types'
import Context from '../models/Context'
import axios from 'axios'

const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_VIDEO_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
const MAX_AUDIO_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
const MAX_MEDIA_GROUP_SIZE = 10

async function safeSendMessage(ctx: Context, chatId: number, text: string) {
  try {
    await ctx.api.sendMessage(chatId, text)
  } catch (e) {
    console.error('Failed to send message:', e)
  }
}

function parseContentLength(header: unknown): number | null {
  if (!header) return null

  if (Array.isArray(header) && typeof header[0] === 'string') {
    const parsed = parseInt(header[0], 10)
    return Number.isNaN(parsed) ? null : parsed
  }

  if (typeof header === 'string') {
    const parsed = parseInt(header, 10)
    return Number.isNaN(parsed) ? null : parsed
  }

  const stringified = String(header)
  const parsed = parseInt(stringified, 10)
  return Number.isNaN(parsed) ? null : parsed
}

async function downloadMedia(
  url: string,
  expectedTypePrefix: string,
  maxSize: number,
  fileName: string
): Promise<InputFile | null> {
  try {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      validateStatus: (status: number) => status >= 200 && status < 300,
    })

    const contentType = res.headers['content-type'] || ''
    if (!contentType.startsWith(expectedTypePrefix)) {
      console.error(
        `Invalid content-type for ${url}: expected ${expectedTypePrefix}*, got ${contentType}`
      )
      return null
    }

    const contentLength = parseContentLength(res.headers['content-length'])
    if (contentLength !== null && contentLength > maxSize) {
      console.error(
        `File too large: ${url}, size: ${contentLength}, limit: ${maxSize}`
      )
      return null
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const buffer = Buffer.from(res.data)
    const uint8 = new Uint8Array(buffer)
    return new InputFile(uint8, fileName)
  } catch (err) {
    console.error(`Error downloading media ${url}:`, err)
    return null
  }
}

async function downloadImage(url: string): Promise<InputFile | null> {
  return await downloadMedia(
    url,
    'image',
    MAX_IMAGE_FILE_SIZE,
    `image-${Date.now()}.jpg`
  )
}

async function downloadVideo(url: string): Promise<InputFile | null> {
  return await downloadMedia(
    url,
    'video',
    MAX_VIDEO_FILE_SIZE,
    `tiktok-${Date.now()}.mp4`
  )
}

async function downloadAudio(url: string): Promise<InputFile | null> {
  return await downloadMedia(
    url,
    'audio',
    MAX_AUDIO_FILE_SIZE,
    `tiktok-audio-${Date.now()}.mp3`
  )
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

  const chatId = ctx.chat.id

  // Поддерживаем обычные и короткие ссылки TikTok, включая vt.tiktok.com и другие поддомены
  const tiktokUrlMatch = text.match(
    /https?:\/\/(?:[a-zA-Z0-9-]+\.)?tiktok\.com\/[^\s]+/i
  )

  if (!tiktokUrlMatch) {
    console.log('No TikTok link found in message:', text)
    return
  }

  const tiktokUrl = tiktokUrlMatch[0]

  await safeSendMessage(ctx, chatId, '⏳ Please wait, fetching content...')

  const reqvideourl =
    'https://www.tikwm.com/api/?url=' + encodeURIComponent(tiktokUrl) + '&hd=1'

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
      await safeSendMessage(ctx, chatId, '❌ ' + data.msg)
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
      const imageUrls = images as string[]
      const downloads = await Promise.all(imageUrls.map(downloadImage))
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
          chatId,
          '❌ Could not download any valid slideshow images.'
        )
        return
      }

      const chunks = chunkArray(validMedia, MAX_MEDIA_GROUP_SIZE)
      for (const chunk of chunks) {
        try {
          await ctx.api.sendMediaGroup(chatId, chunk)
        } catch (err) {
          console.error('Error sending media group:', err)
          await safeSendMessage(
            ctx,
            chatId,
            '❌ Error sending slideshow images.'
          )
        }
      }

      if (hasMusic) {
        try {
          await ctx.api.sendAudio(chatId, music as string, {
            caption: '🎵 Audio from TikTok slideshow',
          })
        } catch (err) {
          console.error('Error sending audio:', err)
          await safeSendMessage(
            ctx,
            chatId,
            '❌ Error sending slideshow audio.'
          )
        }
      }

      return
    }

    if (hasVideo) {
      try {
        const playUrl = play as string
        const videoFile = await downloadVideo(playUrl)
        if (!videoFile) {
          await safeSendMessage(
            ctx,
            chatId,
            '❌ Could not download the TikTok video file.'
          )
          return
        }

        await ctx.api.sendVideo(chatId, videoFile, {
          caption: '📹 Here is your TikTok video!',
        })

        if (hasMusic) {
          const audioFile = await downloadAudio(music as string)
          if (audioFile) {
            await ctx.api.sendAudio(chatId, audioFile, {
              caption: '🎵 Background music',
            })
          } else {
            console.error('Failed to download TikTok background music.')
          }
        }
      } catch (err) {
        console.error('Error sending video:', err)
        await safeSendMessage(ctx, chatId, '❌ Error sending TikTok video.')
      }
      return
    }

    if (hasMusic) {
      try {
        const audioFile = await downloadAudio(music as string)
        if (!audioFile) {
          await safeSendMessage(
            ctx,
            chatId,
            '❌ Error downloading TikTok audio.'
          )
          return
        }

        await ctx.api.sendAudio(chatId, audioFile, {
          caption: '🎧 TikTok audio',
        })
      } catch (err) {
        console.error('Error sending audio:', err)
        await safeSendMessage(ctx, chatId, '❌ Error sending TikTok audio.')
      }
      return
    }

    await safeSendMessage(ctx, chatId, '❌ Unsupported content format.')
  } catch (error) {
    console.error('Error fetching TikTok content:', error)
    await safeSendMessage(
      ctx,
      chatId,
      '❌ An error occurred while fetching the TikTok content.'
    )
  }
}
