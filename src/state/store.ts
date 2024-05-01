import { ProfileSchema } from '@/types/profile'
import { SettingsSchema } from '@/types/settings'
import { WindowSchema } from '@/types/window'
import { Store } from 'tauri-plugin-store-api'

export const store = new Store('.settings.json')

export async function loadSettingsFromStore() {
  const data = await store.get('settings')

  let s = null

  if (data) {
    s = SettingsSchema.parse(data)
  } else {
    const defaultProfile = ProfileSchema.parse({
      name: 'Default Profile',
    })

    const defaultWindow = WindowSchema.parse({
      name: 'Default Window',
      profile: defaultProfile.id,
    })

    s = SettingsSchema.parse({
      profile: [defaultProfile],
      window: [defaultWindow],
    })

    await store.set('settings', s)
    await store.save()
  }

  return s
}
