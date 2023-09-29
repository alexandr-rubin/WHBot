import Context from '../models/Context'

export default async function goDota(ctx: Context) {
  if (ctx.chat) {
    const chatId = ctx.chat.id
    const chatMembers = await ctx.api.getChatAdministrators(chatId)

    const mentions: string[] = []
    chatMembers.forEach((member) => {
      if (!member.user.is_bot) {
        const mention = member.user.username
          ? `<a href="tg://user?id=${member.user.id}">${member.user.username}</a>`
          : `<a href="tg://user?id=${member.user.id}">${member.user.first_name}</a>(без юзернейма)`
        mentions.push(mention)
      }
    })
    //this.bot.telegram.sendMessage(ctx.chat.id, mentions.join(' '), {parse_mode: 'HTML'})
    await ctx.api.sendMessage(ctx.chat.id, mentions.join(' '), {
      parse_mode: 'HTML',
    })
  }
}
