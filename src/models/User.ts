import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ required: true, index: true, unique: true })
  id!: number
  @prop({ required: true, default: 'en' })
  language!: string
  @prop({ required: true, default: 0 })
  piCount!: string
}

const UserModel = getModelForClass(User)

export function findOrCreateUser(id: number) {
  return UserModel.findOneAndUpdate(
    { id },
    {},
    {
      upsert: true,
      new: true,
    }
  )
}

export function increasePi(id: number) {
  return UserModel.findOneAndUpdate(
    { id },
    { $inc: { piCount: 1 } },
    {
      upsert: true,
      new: true,
    }
  )
}
