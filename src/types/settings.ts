import { z } from 'zod'
import { ProfileSchema } from './profile'
import { WindowSchema } from './window'

export const GeneralSchema = z
  .object({
    theme: z.string().default('forest'),
    quitOnClose: z.coerce.boolean().default(false),
    defaultProfile: z.string().default(''),
  })
  .default({})

export type IGeneralSchema = z.infer<typeof GeneralSchema>

export const SettingsSchemaBase = z.object({
  profile: ProfileSchema,
  window: WindowSchema,
})

export type ISettingsSchemaBase = z.infer<typeof SettingsSchemaBase>

export const SettingsSchema = z.object({
  profile: ProfileSchema.array(),
  window: WindowSchema.array(),
  general: GeneralSchema,
})

export type ISettingsSchema = z.infer<typeof SettingsSchema>

export type ISettingsSchemaKey = keyof ISettingsSchema
