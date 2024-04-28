import { NestedKeyOf } from '@/lib/utils'
import { ReactNode } from 'react'
import { z } from 'zod'
import { HexColorSchema, Overwrite, Themes } from './utils'
import { v4 as uuidv4 } from 'uuid'

export const ProfileSchema = z.object({
  id: z.string().uuid().default(uuidv4),
  name: z.string().default('default'),
  url: z.string().default(''),
  token: z.string().default(''),
  fetchInterval: z.coerce.number().default(2000),
  appearance: z
    .object({
      theme: z.enum(Themes).default('forest'),
      backgroundTransparency: z.coerce.number().min(0).max(100).default(100),
      nonInteractive: z.coerce.boolean().default(true),
      position: z.coerce.number().default(0),
      x: z.coerce.number().default(0),
      y: z.coerce.number().default(0),
      width: z.coerce.number().default(200),
      height: z.coerce.number().default(200),
      showDelta: z.coerce.boolean().default(true),
      showLastUpdated: z.coerce.boolean().default(true),
      showDirection: z.coerce.boolean().default(true),

      overwrites: z
        .object({
          background: Overwrite(HexColorSchema).default({}),
          urgent: Overwrite(HexColorSchema).default({}),
          warn: Overwrite(HexColorSchema).default({}),
          ok: Overwrite(HexColorSchema).default({}),
        })
        .default({}),
    })
    .default({}),

  fetchThresholds: z.coerce.boolean().default(true),
  thresholds: z
    .object({
      high: z.coerce.number().default(260),
      low: z.coerce.number().default(55),
      targetBottom: z.coerce.number().default(80),
      targetTop: z.coerce.number().default(180),
    })
    .default({}),

  quitOnClose: z.coerce.boolean().default(false),
})

export type IProfileSchema = z.infer<typeof ProfileSchema>

export interface IProfileGroup {
  name: string
  children: IProfileOption[]
}

export interface IProfileOption {
  name: NestedKeyOf<IProfileSchema>
  label?: string
  placeholder?: string
  value?: string
  type?: string
  width?: string
  opts?: any
  children?: ReactNode
  customProps?: Record<string, any>
  stacked?: boolean
  className?: string
}
