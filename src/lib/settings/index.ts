// import { ProfileSchema } from '@/state/settings/profile'
// import { uniqueNameInZodArray } from '@/state/settings/utils'
// import { WindowSchema } from '@/state/settings/window'
// import { Store } from 'tauri-plugin-store-api'
// import { z } from 'zod'

// export const SettingsSchemaBase = z.object({
//   profile: ProfileSchema,
//   window: WindowSchema,
// })

// export type ISettingsSchemaBase = z.infer<typeof SettingsSchemaBase>

// export const SettingsSchema = z.object({
//   profile: ProfileSchema.array().refine(...uniqueNameInZodArray('id')),
//   window: WindowSchema.array().refine(...uniqueNameInZodArray('id')),
// })

// export type ISettingsSchema = z.infer<typeof SettingsSchema>

// export type ISettingsSchemaKey = keyof ISettingsSchema

// const store = new Store('.settings.json')

// async function loadAll() {
//   const data = await store.get('settings')

//   console.log('settings loaded', data)

//   if (data) {
//     return SettingsSchema.parse(data)
//   }

//   const defaultProfile = ProfileSchema.parse({
//     name: 'Default Profile',
//   })

//   const defaultWindow = WindowSchema.parse({
//     name: 'Default Window',
//     profile: defaultProfile.id,
//   })

//   const defaultSettings = SettingsSchema.parse({
//     profile: [defaultProfile],
//     window: [defaultWindow],
//   })

//   console.log('defaultSettings', defaultSettings)

//   await store.set('settings', defaultSettings)
//   await store.save()
//   return defaultSettings
// }

// export const settings = {
//   loadAll,
// }
