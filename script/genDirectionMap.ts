import fs from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const iconFolder = join(__dirname, '../src/assets/icons')
const files = await fs.readdir(iconFolder)

const iconMap = {
  arrowDown: 'SingleDown',
  arrowDownRight: 'FortyFiveDown',
  arrowNarrowRight: 'Flat',
  arrowsDown: 'DoubleDown',
  arrowsUp: 'DoubleUp',
  arrowUp: 'SingleUp',
  arrowUpRight: 'FortyFiveUp',
  chevronsDown: 'TripleDown',
  chevronsUp: 'TripleUp',
  minus: 'NOT COMPUTABLE',
  x: 'RATE OUT OF RANGE',
}

const directionMap: Record<string, string> = {
  NONE: '',
}

for (const f of files) {
  if (!f.endsWith('.svg')) continue

  const filePath = join(iconFolder, f)
  const content = await fs.readFile(filePath, 'utf-8')
  const iconName = basename(f, '.svg').replace(/-([a-z])/g, (x) =>
    x[1].toUpperCase(),
  )

  const startIndex = content.indexOf('>')
  const endIndex = content.lastIndexOf('</svg>')
  const svgContent = content
    .substring(startIndex + 1, endIndex)
    .replaceAll('\n', '')
    .trim()

  directionMap[iconMap[iconName]] = svgContent
}

const outFile = join(__dirname, '../src/lib/directionMap.ts')
const f = await fs.open(outFile, 'w')

await f.write('// This file is auto-generated. Do not edit manually.\n\n')

await f.write('export const DirectionMap: Record<string, string> = {\n')

for (const [key, value] of Object.entries(directionMap)) {
  await f.write(`"${key}": '${value}',\n`)
}

await f.write('};\n')
