import fastify from 'fastify'

function rand(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

interface INSSettings {
  settings: {
    thresholds: {
      bgHigh: number
      bgLow: number
      bgTargetBottom: number
      bgTargetTop: number
    }
  }
}

interface INSSGV {
  direction: string
  scaled: number
  mills: number
}

interface INSStatus {
  bgnow: {
    sgvs: Array<INSSGV>
  }
  delta?: {
    absolute: number
    display: string
  }
}

const Directions = [
  'DoubleDown',
  'DoubleUp',
  'Flat',
  'FortyFiveDown',
  'FortyFiveUp',
  'NONE',
  'NOT COMPUTABLE',
  'RATE OUT OF RANGE',
  'SingleDown',
  'SingleUp',
  'TripleDown',
  'TripleUp',
]

class Mock {
  private updater: NodeJS.Timer
  private cache: Map<string, any>

  constructor() {
    this.cache = new Map()
    this.update()
    this.updater = setInterval(() => this.update.apply(this), 2000)
  }

  public get<T>(key: string): T {
    return this.cache.get(key) as T
  }

  private set<T>(key: string, value: T) {
    return this.cache.set(key, value)
  }

  private update() {
    const settings: INSSettings = {
      settings: {
        thresholds: {
          bgHigh: 260,
          bgLow: 55,
          bgTargetBottom: 80,
          bgTargetTop: 180,
        },
      },
    }

    this.set<INSSettings>('settings', settings)

    const newStatusValue = rand(
      settings.settings.thresholds.bgLow - 20,
      settings.settings.thresholds.bgHigh + 20
    )

    const oldStatus = this.get<INSStatus>('status')

    const oldStatusValue = oldStatus?.bgnow?.sgvs[0]?.scaled

    let delta

    if (oldStatusValue) {
      const newDeltaValue = newStatusValue - oldStatusValue

      const display =
        newDeltaValue >= 0 ? `+${newDeltaValue}` : newDeltaValue.toString()

      delta = {
        absolute: newDeltaValue,
        display,
      }
    }

    const status: INSStatus = {
      bgnow: {
        sgvs: [
          {
            direction: 'Flat',
            scaled: newStatusValue,
            mills: Date.now(),
          },
        ],
      },
      delta,
    }

    this.set<INSStatus>('status', status)
  }
}

const server = fastify()
const mock = new Mock()

server.get('/api/v2/properties', async (request, reply) => {
  return mock.get<INSStatus>('status')
})

server.get('/api/v1/status', async (request, reply) => {
  return mock.get<INSSettings>('settings')
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
