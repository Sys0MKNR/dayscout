import { proxy, subscribe } from 'valtio'
import { IProfileSchema, ProfileSchema } from './profile'
import { IWindowSchema, WindowSchema } from './window'
import { uniqueNameInZodArray } from './utils'
import { z } from 'zod'
import { Store } from 'tauri-plugin-store-api'
import { derive } from 'derive-valtio'
import {
  ISettingsSchema,
  SettingsSchema,
  ISettingsSchemaBase,
  SettingsSchemaBase,
} from './settings'

import { event } from '@tauri-apps/api'
const { emit, listen } = event

// store.onKeyChange('settings', (value) => {
//   const settings = SettingsSchema.parse(value)
//   state.profile = settings.profile
//   state.window = settings.window
// })

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

const store = new Store('.settings.json')

interface SettingsState {
  data: ISettingsSchema
  unsubscribe: () => void
}

const state = proxy<SettingsState>({
  data: { profile: [], window: [] },
  unsubscribe: () => {},
})

async function load() {
  const data = await store.get('settings')

  console.log('data', data)

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

  console.log('settings loaded', s)

  return s

  // state.profile = s.profile
  // state.window = s.window
}

async function init() {
  const s = await load()

  state.data = s

  const unsubStoreUpdates = subscribe(state, async () => {
    store.set('settings', state.data)
    await store.save()
    console.log('settings saved', state.data)
    // emit('settings-updated')
  })

  const unsubGlobalUpdates = await listen('settings-updated', async () => {
    // const s = await load()
    // state.data = s
  })

  const unsubscribe = () => {
    unsubStoreUpdates()
    unsubGlobalUpdates()
  }

  return unsubscribe
}

const $ = derive({
  profileMap: (get) => {
    return get(state).data.profile.reduce(
      (acc, p) => {
        acc[p.id] = p
        return acc
      },
      {} as Record<string, IProfileSchema>
    )
  },
  windowMap: (get) => {
    return get(state).data.window.reduce(
      (acc, p) => {
        acc[p.id] = p
        return acc
      },
      {} as Record<string, IWindowSchema>
    )
  },
})

function get<
  T extends keyof ISettingsSchemaBase,
  U extends ISettingsSchemaBase[T],
>(t: T, id: string): U {
  const obj = state.data[t].find((o) => o.id === id)

  if (!obj) {
    throw new Error('Object not found')
  }

  return obj as U
}

function getIndex<
  T extends keyof ISettingsSchemaBase,
  U extends ISettingsSchemaBase[T],
>(t: T, id: string): number {
  const index = state.data[t].findIndex((o) => o.id === id)

  if (index === -1) {
    throw new Error('Object not found')
  }

  return index
}

function create<
  T extends keyof ISettingsSchemaBase,
  U extends ISettingsSchemaBase[T],
>(t: T, data?: Partial<U>): U {
  const obj = SettingsSchemaBase.shape[t].parse(data || {}) as U
  state.data[t].push(obj as any)
  return obj
}

function duplicate<
  T extends keyof ISettingsSchemaBase,
  U extends ISettingsSchemaBase[T],
>(t: T, id: string): U {
  const obj = get(t, id)

  const newObj = SettingsSchemaBase.shape[t].parse({
    ...obj,
    id: undefined,
    name: `${obj.name} (copy)`,
  }) as U

  console.log('duplicate', newObj)

  state.data[t].push(newObj as any)

  return newObj
}

function update<
  T extends keyof ISettingsSchemaBase,
  U extends ISettingsSchemaBase[T],
>(t: T, id: string, data: Partial<U>) {
  const index = getIndex(t, id)

  state.data[t][index] = Object.assign(state.data[t][index], data)

  console.log('new state:', state)

  return state.data[t][index]
}

function remove<T extends keyof ISettingsSchemaBase>(t: T, id: string) {
  const index = getIndex(t, id)

  state.data[t].splice(index, 1)
}

export const settings = {
  $,
  create,
  duplicate,
  get,
  getIndex,
  load,
  remove,
  state,
  update,
  init,
}
