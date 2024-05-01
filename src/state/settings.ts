import { IProfileSchema } from '@/types/profile'
import {
  ISettingsSchema,
  ISettingsSchemaBase,
  SettingsSchemaBase,
} from '@/types/settings'
import { IWindowSchema } from '@/types/window'
import { event } from '@tauri-apps/api'
import { derive } from 'derive-valtio'
import { proxy, subscribe } from 'valtio'
import { loadSettingsFromStore, store } from './store'

interface SettingsState {
  ready: boolean
  data: ISettingsSchema
  unsubscribe: () => void
}

const state = proxy<SettingsState>({
  ready: false,
  data: { profile: [], window: [] },
  unsubscribe: () => {},
})

async function init() {
  const s = await loadSettingsFromStore()

  const unsubStoreUpdates = subscribe(state, async () => {
    store.set('settings', state.data)
    await store.save()
    event.emit('settings-updated', state.data)
  })

  state.data = s
  state.ready = true
  state.unsubscribe = () => {
    unsubStoreUpdates()
  }
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

function getIndex<T extends keyof ISettingsSchemaBase>(
  t: T,
  id: string
): number {
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

  state.data[t].push(newObj as any)

  return newObj
}

function update<
  T extends keyof ISettingsSchemaBase,
  U extends ISettingsSchemaBase[T],
>(t: T, id: string, data: Partial<U>) {
  const index = getIndex(t, id)

  state.data[t][index] = Object.assign(state.data[t][index], data)

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
  remove,
  state,
  update,
  init,
}
