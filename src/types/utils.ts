import { Position } from 'tauri-plugin-positioner-api'
import { z } from 'zod'

export const Themes: Readonly<[string, ...string[]]> = [
  'acid',
  'aqua',
  'autumn',
  'black',
  'bumblebee',
  'business',
  'cmyk',
  'coffee',
  'corporate',
  'cupcake',
  'cyberpunk',
  'dark',
  'dracula',
  'emerald',
  'fantasy',
  'forest',
  'garden',
  'halloween',
  'lemonade',
  'light',
  'lofi',
  'luxury',
  'night',
  'pastel',
  'retro',
  'synthwave',
  'valentine',
  'winter',
  'wireframe',
]

function genPositions(): [string, number][] {
  const TauriPositions = Object.entries(Position).slice(0, 9)

  const Positions = [[-2, 'Manual'], [-1, 'Custom'], ...TauriPositions] as [
    string,
    number,
  ][]

  return Positions
}

export const Positions = genPositions()

export const HexColorSchema = z
  .string()
  .min(4)
  .max(9)
  .startsWith('#')
  .default('#000000')

export const Overwrite = <T extends z.ZodTypeAny>(type: T) =>
  z.object({
    active: z.coerce.boolean().default(false),
    value: type,
  })

export function uniqueNameInZodArray(key: string = 'id') {
  const fn: any = (items: any) => {
    return new Set(items.map((i: any) => i[key])).size === items.length
  }

  return [
    fn,
    { message: `Values of property ${key} in array have to be unique` },
  ] as const
}
