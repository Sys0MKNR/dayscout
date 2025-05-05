import { z } from 'zod'
import { ProfileSchema } from './profile'
import { WindowSchema } from './window'

export const GeneralSchema = z
  .object({
    theme: z.string().default('forest'),
    quitOnClose: z.coerce.boolean().default(false),
    defaultProfile: z.string().default(''),
    startOnStartup: z.coerce.boolean().default(false),
  })
  .default({})

export type IGeneralSchema = z.infer<typeof GeneralSchema>

export const ListSettingsSchema = z.object({
  profile: ProfileSchema,
  window: WindowSchema,
})

export type IListSettingsSchema = z.infer<typeof ListSettingsSchema>
export type IListSettingsSchemaKey = keyof IListSettingsSchema

export const SettingsSchema = z.object({
  profile: z.array(ProfileSchema).default([]),
  window: z.array(WindowSchema).default([]),
  general: GeneralSchema.default({}),
})

export type ISettingsSchema = z.infer<typeof SettingsSchema>
export type ISettingsSchemaKey = keyof ISettingsSchema

// export IListSettingsSchem

// export function isListSetting(
//   key: string,
//   arr: any
// ): key is IListSettingsSchemaKey {
//   return Array.isArray(arr) && key in ListSettingsSchema.shape
// }
