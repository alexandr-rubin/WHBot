import { connect } from 'mongoose'
import env from '@/helpers/env'

function startMongo() {
  return connect(env.MONGOLOCAL)
}

export default startMongo
