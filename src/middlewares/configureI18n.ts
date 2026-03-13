import { NextFunction } from 'grammy'
import Context from '../models/Context'

function configureI18n(ctx: Context, next: NextFunction) {
  const lang = ctx.dbuser?.language ?? 'en'
  ctx.i18n.locale(lang)
  return next()
}

export default configureI18n
