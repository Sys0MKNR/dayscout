import { initLogger } from './lib/utils'

initLogger()

import { getCurrentWindow } from '@tauri-apps/api/window'
import textfit from 'textfit'

import './status.css'
import { type Event, listen } from '@tauri-apps/api/event'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { settings } from './lib/settings'
import type { IOverlaySchema, Status, StatusPayload } from './lib/types'

dayjs.extend(relativeTime)

import { DirectionMap } from './lib/directionMap'

const root = document.getElementById('root') as HTMLDivElement
const loader = document.getElementById('loader') as HTMLDivElement

const statusBox = document.getElementById('status-box') as HTMLDivElement

const valueBox = document.getElementById('value') as HTMLDivElement
const valueBoxText = document.getElementById('value-text') as HTMLSpanElement
const valueBoxIcon = document.getElementById('value-icon') as HTMLDivElement
const deltaBox = document.getElementById('delta') as HTMLElement
const deltaBoxText = document.getElementById('delta-text') as HTMLSpanElement
const lastUpdatedBox = document.getElementById('last-updated') as HTMLDivElement
const lastUpdatedBoxText = document.getElementById(
  'last-updated-text',
) as HTMLSpanElement

let overlay: IOverlaySchema | null = null
let width = 0
let height = 0
let lastData: Status | null = null
let layoutUpdating = false

async function main() {
  await updateLayout()

  await listen('overlay-update', async () => {
    console.debug('Overlay update event received, updating layout...')
    await updateLayout()
  })

  await listen<StatusPayload>('status-update', (event) => {
    update(event)
  })

  setInterval(() => {
    if (lastData && overlay?.statusItems.lastUpdated.enabled) {
      lastUpdatedBoxText.innerHTML = dayjs(lastData.timestamp).from(dayjs())
    }
  }, 1000)
}

async function loadOverlay() {
  const w = await getCurrentWindow()
  const overlayId = w.label.split('_')[0]
  const o = await settings.overlays.getOne(overlayId)

  console.debug('Loading overlay for label :', w.label, o)

  if (!o) {
    console.error('Overlay not found:', overlayId)
    throw new Error(`Overlay not found: ${overlayId}`)
  }

  return o
}

async function updateLayout() {
  layoutUpdating = true

  overlay = await loadOverlay()

  const backgroundColor = overlay.transparent
    ? 'transparent'
    : overlay.colors.background

  statusBox.classList.add('hidden-soft')
  loader.style.backgroundColor = backgroundColor
  loader.style.color = overlay.colors.ok
  loader.classList.remove('hidden')

  width = overlay.width - overlay.padding * 2
  height = overlay.height - overlay.padding * 2
  root.style.height = `${height.toString()}px`
  root.style.width = `${width.toString()}px`
  root.style.fontFamily = overlay.font
  root.style.padding = `${overlay.padding.toString()}px`
  root.style.backgroundColor = backgroundColor
  root.style.color = overlay.colors.ok
  root.style.opacity = overlay.opacity.toString()

  const valueItem = overlay.statusItems.value
  const iconItem = overlay.statusItems.icon

  if (valueItem.enabled) {
    valueBox.classList.remove('hidden')
    valueBox.style.flexBasis = `${valueItem.size}%`
    valueBoxText.innerText = `444${iconItem.enabled ? 'W' : ''}`

    textfit(valueBox, {
      alignVertWithFlexbox: true,
      alignHoriz: true,
      maxFontSize: 500,
    })
  } else {
    valueBox.classList.add('hidden')
  }

  if (iconItem.enabled) {
    const iconSize = parseFloat(valueBoxText.style.fontSize) * 0.75
    valueBoxIcon.setAttribute('width', iconSize.toString())
    valueBoxIcon.setAttribute('height', iconSize.toString())
  } else {
    valueBoxIcon.setAttribute('width', '0')
    valueBoxIcon.setAttribute('height', '0')
  }

  const deltaItem = overlay.statusItems.delta

  if (deltaItem.enabled) {
    deltaBox.classList.remove('hidden')
    deltaBox.style.flexBasis = `${deltaItem.size}%`
    deltaBoxText.innerText = '+444'

    textfit(deltaBox, {
      alignVertWithFlexbox: true,
      alignHoriz: true,
      maxFontSize: 500,
    })
  } else {
    deltaBox.classList.add('hidden')
  }

  const lastUpdatedItem = overlay.statusItems.lastUpdated

  if (lastUpdatedItem.enabled) {
    lastUpdatedBox.classList.remove('hidden')
    lastUpdatedBox.style.height = `${lastUpdatedItem.size}%`
    lastUpdatedBoxText.innerText = 'a few seconds ago'

    textfit(lastUpdatedBox, {
      alignVertWithFlexbox: true,
      alignHoriz: true,
      maxFontSize: 500,
    })
  } else {
    lastUpdatedBox.classList.add('hidden')
  }

  layoutUpdating = false
}

async function update(event: Event<StatusPayload>) {
  if (layoutUpdating) {
    console.warn('Layout is updating, skipping status update')
    return
  }

  if (!overlay) {
    console.warn('Overlay is not loaded, cannot update status')
    return
  }

  const payload = event.payload

  if (!payload || !payload.overlayId) {
    console.warn('Invalid event payload:', event)
    return
  }

  if (overlay.id !== payload.overlayId) {
    return
  }

  if (payload.error) {
    console.error('Error in status update:', payload.error)
    return
  }

  loader.classList.add('hidden')
  statusBox.classList.remove('hidden-soft')

  const data = event.payload.data as Status

  const valueItem = overlay.statusItems.value
  const iconItem = overlay.statusItems.icon

  if (valueItem.enabled) {
    valueBoxText.innerText = data.value.toString()
    if (iconItem.enabled) {
      valueBoxIcon.innerHTML = DirectionMap[data.direction] || ''
    }
  }

  const deltaItem = overlay.statusItems.delta
  if (deltaItem.enabled) {
    deltaBoxText.innerText = data.deltaText
  }

  const lastUpdatedItem = overlay.statusItems.lastUpdated
  if (lastUpdatedItem.enabled) {
    lastUpdatedBoxText.innerText = dayjs(data.timestamp).from(dayjs())
  }

  let statusColor = overlay.colors.ok

  switch (data.state) {
    case 'Urgent':
      statusColor = overlay.colors.urgent
      break
    case 'Warn':
      statusColor = overlay.colors.warn
      break
    default:
      break
  }

  root.style.color = statusColor

  lastData = data
}

main()
  .then(() => {})
  .catch((error) => {
    console.error('Error in main function:', error)
  })
