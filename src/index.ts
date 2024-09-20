import { Context, h, Schema } from 'koishi'

export const name = 'soup'

export interface Config {
  SoupReplyquote: boolean
}

export const Config: Schema<Config> = Schema.object({
  SoupReplyquote: Schema.boolean().default(true).description('是否在回复时引用用户消息'),
})

export function apply(ctx: Context, config: Config) {
  const jt  = "68747470733a2f2f6170692e61796672652e636f6d2f6a743f747970653d6b6f69736869267665723d312e302e30";
  const djt = "68747470733a2f2f6170692e61796672652e636f6d2f646a743f747970653d6b6f69736869267665723d312e302e30";
  ctx.middleware(async (session, next) => {
    if (!session.guildId || !/^\d+$/.test(session.guildId) || !['qq', 'onebot'].includes(session.platform)) return next();
    if (session.content === '鸡汤') {
      try {
        const res = await ctx.http.get(Buffer.from(jt, 'hex').toString());
        if (res.includes("wwwroot") || res.includes("html") || res.length === 1) return;
        return (config.SoupReplyquote ? h('quote', { id: session.messageId }) : '') + res;
      } catch (error) {
        ctx.logger('soup').warn('Server connection failed.');
      }
    }
    if (session.content === '毒鸡汤') {
      try {
        const res = await ctx.http.get(Buffer.from(djt, 'hex').toString());
        if (res.includes("wwwroot") || res.includes("html") || res.length === 1) return;
        return (config.SoupReplyquote ? h('quote', { id: session.messageId }) : '') + res;
      } catch (error) {
        ctx.logger('soup').warn('Server connection failed.');
      }
    }
    return next();
  })
}
