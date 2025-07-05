import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod/v4'

export const GeneralSchema = z.object({
  quitOnClose: z.boolean().default(false),
  startOnStartup: z.boolean().default(false),
  onlyOverlaysOnStart: z.boolean().default(false),
  LogLevel: z.enum(['error', 'warn', 'info', 'debug', 'trace']).default('info'),
})

export type IGeneralSchema = z.infer<typeof GeneralSchema>

export const Position = {
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

export const PositionOptions = Object.entries(Position).map(([key, value]) => ({
  value: value,
  label: key,
}))

export const PositionTypes = ['preset', 'custom', 'manual'] as const
export type PositionType = (typeof PositionTypes)[number]
export const PositionTypeOptions = PositionTypes.map((value) => ({
  value: value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}))

const htmlColorInputSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, {
  message:
    'Invalid color format. Must be a 7-character hex code (e.g., #RRGGBB).',
})

export const OverlaySchema = z.object({
  id: z.uuid().default(uuidv4),
  name: z.string().nonempty().default('Overlay'),
  enabled: z.boolean().default(true),
  allMonitors: z.boolean().default(true),
  monitors: z.array(z.string()).default([]),
  url: z.url().default('http://localhost:8080'),
  token: z.string().default(''),
  fetchInterval: z.number().default(2000),
  thresholds: z
    .object({
      high: z.number().optional(),
      low: z.number().optional(),
      targetBottom: z.number().optional(),
      targetTop: z.number().optional(),
    })
    .prefault({}),
  position: z.enum(PositionTypes).default('preset'),
  customPosition: z
    .object({
      x: z.number().default(0),
      y: z.number().default(0),
    })
    .prefault({}),

  presetPosition: z.enum(Position).default(Position['Top Right']),
  width: z.number().default(200),
  height: z.number().default(200),
  interactive: z.boolean().default(false),
  opacity: z.number().min(0).max(1).default(0.7),
  padding: z.number().default(12),
  transparent: z.boolean().default(false),
  font: z.string().default('Verdana'),
  colors: z
    .object({
      urgent: htmlColorInputSchema.default('#ff8787'),
      warn: htmlColorInputSchema.default('#ffd43b'),
      ok: htmlColorInputSchema.default('#c9c9c9'),
      background: htmlColorInputSchema.default('#424242'),
    })
    .prefault({}),
  statusItems: z
    .object({
      value: z
        .object({
          enabled: z.boolean().default(true),
          size: z.number().default(55),
        })
        .prefault({}),
      icon: z
        .object({
          enabled: z.boolean().default(true),
          size: z.number().default(75),
        })
        .prefault({}),
      delta: z
        .object({
          enabled: z.boolean().default(true),
          size: z.number().default(30),
        })
        .prefault({}),
      lastUpdated: z
        .object({
          enabled: z.boolean().default(true),
          size: z.number().default(15),
        })
        .prefault({}),
    })
    .prefault({}),
})

export type IOverlaySchema = z.infer<typeof OverlaySchema>

export const SettingsSchema = z.object({
  overlays: z.array(OverlaySchema),
  general: GeneralSchema,
})

export type ISettingsSchema = z.infer<typeof SettingsSchema>
export type ISettingsSchemaKey = keyof ISettingsSchema

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
