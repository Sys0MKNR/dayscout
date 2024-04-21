// import { event } from '@tauri-apps/api'
// const { emit, listen } = event

// import { z } from 'zod'

// import { Store } from 'tauri-plugin-store-api'
// import { proxy } from 'valtio'

// import { ProfileSchema } from './settings/profile'
// import { uniqueNameInZodArray } from './settings/utils'
// import { WindowSchema } from './settings/window'

// const store = new Store('.settings.dat')

// const load = async (full = false) => {
//   if (full) {
//     try {
//       await store.load()
//     } catch (error) {}
//   }

//   const settings = await store.get('settings')

//   const s = SettingsSchema.parse(settings)

//   // const entries = await store.entries()

//   // const s = entries.map(([_, value]) => ProfileSchema.parse(value))

//   // if (s.length === 0) {
//   //   const defaultSettings = ProfileSchema.parse({ default: true })
//   //   await store.set('default', defaultSettings)
//   //   await store.save()
//   //   return [defaultSettings]
//   // }

//   console.log('settings loaded', s)

//   return s
// }

// export const state = proxy({ settings: load(true) })

// // export const updateSettings = async (
// //   name: string,
// //   settings: IProfileSchema
// // ) => {
// //   await store.set(name, settings)
// //   await store.save()
// //   emit('settings-updated')
// // }

// // export function listenToSettingsChange() {
// //   return listen('settings-updated', () => {
// //     console.log('settings updated')
// //     state.settings = load()
// //   })
// // }
