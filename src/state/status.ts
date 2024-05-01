import { proxy } from 'valtio'
import { IProfileSchema } from '@/types/profile'
import { IWindowSchema } from '@/types/window'
import { loadSettingsFromStore } from './store'

interface StatusState {
  ready: boolean
  profile: IProfileSchema | null
  window: IWindowSchema | null
  unsubscribe: () => void
}

const state = proxy<StatusState>({
  ready: false,
  profile: null,
  window: null,
  unsubscribe: () => {},
})

async function init(profile: string, window: string) {
  const settings = await loadSettingsFromStore()

  const p = settings.profile.find((p) => p.id === profile)

  if (!p) {
    throw new Error('Profile not found')
  }

  state.profile = p

  const w = settings.window.find((w) => w.id === window)

  if (!w) {
    throw new Error('Window not found')
  }

  state.window = w

  if (!state.ready) {
    state.ready = true
  }
}

export const status = {
  state,
  init,
}
