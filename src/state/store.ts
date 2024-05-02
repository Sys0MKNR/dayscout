import { ProfileSchema } from '@/types/profile'
import { GeneralSchema, SettingsSchema } from '@/types/settings'
import { WindowSchema } from '@/types/window'
import { Store } from 'tauri-plugin-store-api'

export const store = new Store('.settings.json')

const VERSION = 1

export async function loadSettingsFromStore() {
  const version = await store.get('version')
  let data = await store.get('settings')

  if (version !== VERSION) {
    await store.set('settings_backup' + Date.now(), data)
    await store.save()
    data = null
  }

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

    const general = GeneralSchema.parse({})

    s = SettingsSchema.parse({
      profile: [defaultProfile],
      window: [defaultWindow],
      general,
    })

    await store.set('settings', s)
    await store.set('version', VERSION)
    await store.save()
  }

  return s
}
