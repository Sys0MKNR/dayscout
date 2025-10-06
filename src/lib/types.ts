export interface Settings {
  quitOnClose: boolean
  startOnStartup: boolean
  onlyOverlaysOnStart: boolean
  LogLevel: 'error' | 'warn' | 'info' | 'debug' | 'trace'
}

export const WindowPositions = {
  'Top Left': '0',
  'Top Right': '1',
  'Bottom Left': '2',
  'Bottom Right': '3',
  'Top Center': '4',
  'Bottom Center': '5',
  'Left Center': '6',
  'Right Center': '7',
  Center: '8',
  'Tray Left': '9',
  'Tray Bottom Left': '10',
  'Tray Right': '11',
  'Tray Bottom Right': '12',
  'Tray Center': '13',
  'Tray Bottom Center': '14',
}

export const WindowPositionsOptions = Object.entries(WindowPositions).map(
  ([key, value]) => ({
    value: value,
    label: key,
  }),
)

export const PositionTypes = ['Preset', 'Custom', 'Manual'] as const
export type PositionType = (typeof PositionTypes)[number]

export interface OverlayStatusItem {
  enabled: boolean
  size: number
}

export interface Overlay {
  id: string
  name: string
  enabled: boolean
  allMonitors: boolean
  monitors: string[]
  url: string
  token: string
  fetchInterval: number
  thresholds: {
    high?: number | string
    low?: number | string
    targetBottom?: number | string
    targetTop?: number | string
  }
  position: PositionType
  customPosition: {
    x: number
    y: number
  }
  presetPosition: string
  width: number
  height: number
  interactive: boolean
  opacity: number
  padding: number
  transparent: boolean
  font: string
  colors: {
    urgent: string
    warn: string
    ok: string
    background: string
  }
  statusItems: {
    value: OverlayStatusItem
    icon: OverlayStatusItem
    delta: OverlayStatusItem
    lastUpdated: OverlayStatusItem
  }
}

export interface Status {
  delta: number
  deltaText: string
  direction: string
  lastUpdatedText: string
  state: string
  timestamp: string
  value: number
}

export interface StatusPayload {
  overlayId: string
  error_count: number
  stopped: boolean
  data?: Status
  error?: string
}
