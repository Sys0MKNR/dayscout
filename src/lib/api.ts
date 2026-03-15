import { invoke } from '@tauri-apps/api/core'
import type { Overlay, Settings } from './types'
import { availableMonitors } from '@tauri-apps/api/window'

function getOverlays() {
  return invoke<Overlay[]>('get_overlays')
}

function getOverlay(id: string) {
  return invoke<Overlay>('get_overlay', { id })
}

function setOverlay(overlay: Overlay) {
  return invoke<Overlay[]>('set_overlay', { overlay })
}

function setOverlayEnabled(id: string, enabled: boolean) {
  return invoke('set_overlay_enabled', { id, enabled })
}

function deleteOverlay(id: string) {
  return invoke('delete_overlay', { id })
}

function getFonts() {
  return invoke<string[]>('get_fonts')
}

function getSettings() {
  return invoke<Settings>('get_settings')
}

function setSettings(settings: Settings) {
  return invoke<void>('set_settings', { settings })
}

export async function loadAdditionalFormData() {
  const monitors = (await availableMonitors()).map((m) => m.name).filter((m) => m)
  const fonts = await getFonts()
  return {
    monitors,
    fonts,
  }
}

export const api = {
  overlay: {
    list: getOverlays,
    get: getOverlay,
    set: setOverlay,
    setEnabled: setOverlayEnabled,
    delete: deleteOverlay,
  },
  settings: {
    get: getSettings,
    set: setSettings,
  },
  additionalData: {
    load: loadAdditionalFormData,
  },
}
