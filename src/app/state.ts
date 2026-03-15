import { invoke } from '@tauri-apps/api/core'
import { proxy } from 'valtio'

export const reloadOverlayState = proxy({
  loading: false,
  error: null as string | null,
})

export const reloadOverlays = async () => {
  reloadOverlayState.loading = true
  try {
    await invoke('load_overlays')
  } catch (error) {
    reloadOverlayState.error = error instanceof Error ? error.message : String(error)
    console.error('Error loading overlays:', reloadOverlayState.error)
  }
  reloadOverlayState.loading = false
}
