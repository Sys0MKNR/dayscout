import { deepMerge } from '@mantine/core'
import { invoke } from '@tauri-apps/api/core'
import { disable, enable } from '@tauri-apps/plugin-autostart'
import { LazyStore } from '@tauri-apps/plugin-store'
import {
  GeneralSchema,
  type IGeneralSchema,
  type IOverlaySchema,
  OverlaySchema,
  SettingsSchema,
} from './types'

const store = new LazyStore('.settings.json', { autoSave: true })

async function getOverlay(id: string): Promise<IOverlaySchema | undefined> {
  const data = (await store.get<IOverlaySchema[]>('overlays')) || []
  return data.find((overlay) => overlay.id === id)
}

async function setOverlay(overlay: Partial<IOverlaySchema>): Promise<void> {
  const overlays = (await store.get<IOverlaySchema[]>('overlays')) || []
  const index = overlays.findIndex((o) => o.id === overlay.id)

  let newItem = overlay as IOverlaySchema

  if (index !== -1) {
    newItem = deepMerge(overlays[index], overlay)
  }

  if (index !== -1) {
    overlays[index] = newItem
  } else {
    overlays.push(newItem)
  }
  await store.set('overlays', overlays)
  return invoke('load_overlays')
}

async function removeOverlay(id: string): Promise<void> {
  const overlays = (await store.get<IOverlaySchema[]>('overlays')) || []
  const newItems = overlays.filter((i) => i.id !== id)
  await store.set('overlays', newItems)
  return invoke('load_overlays')
}

async function setGeneral(values: IGeneralSchema) {
  await store.set('general', values)

  if (values.startOnStartup) {
    await enable()
  } else {
    await disable()
  }
}

export const settings = {
  general: {
    get: () => store.get<IGeneralSchema>('general'),
    set: setGeneral,
    new: (values: Partial<IGeneralSchema> = {}) => GeneralSchema.parse(values),
  },
  overlays: {
    get: () => store.get<IOverlaySchema[]>('overlays'),
    getOne: getOverlay,
    set: (values: IOverlaySchema[]) => store.set('overlays', values),
    setOne: setOverlay,
    removeOne: removeOverlay,
    new: (values: Partial<IOverlaySchema> = {}) => OverlaySchema.parse(values),
  },
  reset: () => store.reset(),
  reload: () => store.reload(),
}

export async function initSettings(): Promise<void> {
  let general = await settings.general.get()
  let overlays = await settings.overlays.get()
  if (!general) {
    await settings.general.set(settings.general.new())
    general = await settings.general.get()
  }
  if (!overlays) {
    await settings.overlays.set([])
    await invoke('load_overlays')
    overlays = await settings.overlays.get()
  }

  SettingsSchema.parse({
    general,
    overlays,
  })
}
