import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

export const WindowSchema = z.object({
  id: z.string().uuid().default(uuidv4),
  name: z.string().min(1),
  profile: z.string().optional().nullable(),
  monitor: z.string().optional().nullable(),
  enabled: z.coerce.boolean().default(true),
})

export type IWindowSchema = z.infer<typeof WindowSchema>
