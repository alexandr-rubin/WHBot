import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ required: true, index: true, unique: true })
  id!: number
  @prop({ required: true, default: 'en' })
  language!: string
  @prop({ required: true, default: 0 })
  piCount!: string
  @prop({ required: true })
  userName!: string
}

const UserModel = getModelForClass(User)

export function findOrCreateUser(id: number, userName: string) {
  return UserModel.findOneAndUpdate(
    { id },
    { userName: userName },
    {
      upsert: true,
      new: true,
    }
  )
}

export function increasePi(userName: string) {
  return UserModel.findOneAndUpdate(
    { userName: userName },
    { $inc: { piCount: 1 } },
    {
      upsert: false,
      new: true,
    }
  )
}
