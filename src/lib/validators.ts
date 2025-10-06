import { isNotEmpty, matches } from '@mantine/form'

const isPositive = (value: number) =>
  value <= 0 ? 'Value must be greater than 0' : null

const isColorHex = matches(/^#([0-9a-f]{3}){1,2}$/)

export const validateOverlay = {
  // id: (value) => validateUUID(value) || 'Invalid UUID',
  name: isNotEmpty('Name is required'),
  url: isNotEmpty('URL is required'),
  fetchInterval: isPositive,
  width: isPositive,
  height: isPositive,
  colors: {
    urgent: isColorHex,
    warn: isColorHex,
    ok: isColorHex,
    background: isColorHex,
  },
}
