import { z } from 'zod'
import { ProfileSchema } from './profile'
import { uniqueNameInZodArray } from './utils'
import { WindowSchema } from './window'

export const SettingsSchemaBase = z.object({
  profile: ProfileSchema,
  window: WindowSchema,
})

export type ISettingsSchemaBase = z.infer<typeof SettingsSchemaBase>

export const SettingsSchema = z.object({
  profile: ProfileSchema.array(),
  window: WindowSchema.array(),
})

export type ISettingsSchema = z.infer<typeof SettingsSchema>

export type ISettingsSchemaKey = keyof ISettingsSchema
