import { invoke } from '@tauri-apps/api/core'
import type { Overlay, Settings } from './types'

export function getOverlays() {
  return invoke<Overlay[]>('get_overlays')
}

export function getOverlay(id: string) {
  console.log('getOverlay called with id:', id)
  return invoke<Overlay>('get_overlay', { id })
}

export function setOverlay(overlay: Overlay) {
  return invoke<Overlay[]>('set_overlay', { overlay })
}

export function setOverlayEnabled(id: string, enabled: boolean) {
  return invoke('set_overlay_enabled', { id, enabled })
}

export function deleteOverlay(id: string) {
  return invoke('delete_overlay', { id })
}

export function getFonts() {
  return invoke<string[]>('get_fonts')
}

export function getSettings() {
  return invoke<Settings>('get_settings')
}

export function setSettings(settings: Settings) {
  return invoke<void>('set_settings', { settings })
}
