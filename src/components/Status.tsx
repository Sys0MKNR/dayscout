import { useMemo, useRef } from 'react'
import {
  ArrowDown,
  ArrowDownRight,
  ArrowNarrowRight,
  ArrowsDown,
  ArrowsUp,
  ArrowUp,
  ArrowUpRight,
  ChevronsDown,
  ChevronsUp,
  Icon as IIcon,
  Minus,
  X,
} from 'tabler-icons-react'
import { ISettingsSchema } from '@/hooks/useSettings'
import Loader from './Loader'

import { useQuery } from '@tanstack/react-query'

import {
  getSettings,
  getStatus,
  IGetSettingsArgs,
  IGetStatusArgs,
} from '@/lib/api'

const directionMap: Record<string, IIcon | null> = {
  NONE: null,
  TripleUp: ChevronsUp,
  DoubleUp: ArrowsUp,
  SingleUp: ArrowUp,
  FortyFiveUp: ArrowUpRight,
  Flat: ArrowNarrowRight,
  FortyFiveDown: ArrowDownRight,
  SingleDown: ArrowDown,
  DoubleDown: ArrowsDown,
  TripleDown: ChevronsDown,
  'NOT COMPUTABLE': Minus,
  'RATE OUT OF RANGE': X,
}

const textSizesDefault = {
  delta: 'text-4xl',
  direction: 'text-8xl',
  lastUpdated: 'text-2xl',
  main: 'text-8xl',
}

const textSizesFullScreen = {
  delta: 'text-[12vmin]',
  direction: 'text-[32vmin]',
  lastUpdated: 'text-[10vmin]',
  main: 'text-[32vmin]',
}

export interface StatusProps {
  appearance: ISettingsSchema['appearance']
  url: string
  token: string
  thresholds: ISettingsSchema['thresholds']
  fetchThresholds?: boolean
  fetchInterval?: number
}

const DirectionIcon = (props: { direction: string; size: number }) => {
  const Icon = directionMap[props.direction]

  if (!Icon) {
    return null
  }

  return <Icon size={props.size}> </Icon>
}

function Status(props: StatusProps) {
  console.log('status')
  const { url, token, thresholds, fetchThresholds, fetchInterval } = props

  const retryTimer = useRef<number | null>(null)

  const settingsQuery = useQuery({
    queryKey: ['settings', { url, token, thresholds }],
    queryFn: async ({ queryKey }) => {
      console.log('settings fetch')
      return fetchThresholds
        ? await getSettings(queryKey[1] as IGetSettingsArgs)
        : { thresholds: thresholds }
    },
    retry: 2,
    refetchOnWindowFocus: false,
  })

  const {
    width,
    height: fullHeight,
    showDelta,
    showLastUpdated,
    showDirection,
    overwrites,
  } = props.appearance

  const height = toolbar ? fullHeight - 32 : fullHeight

  const statusQuery = useQuery({
    queryKey: [
      'status',
      { url, token, thresholds: settingsQuery?.data?.thresholds },
    ],
    queryFn: async ({ queryKey }) => {
      return getStatus(queryKey[1] as IGetStatusArgs)
    },
    enabled: !!settingsQuery?.data?.thresholds && !settingsQuery.isError,
    refetchInterval: (data, query) => {
      if (query.state.status === 'error') {
        if (retryTimer.current === null) {
          retryTimer.current = window.setTimeout(() => {
            console.log('refetching')
            statusQuery.refetch()
            retryTimer.current = null
          }, 60000)
        }
        return false
      }

      return fetchInterval || 2000
    },
    retry: 2,
    refetchOnWindowFocus: false,
  })

  const textSize = useMemo(() => {
    // scales
    let mainScale = 0.4
    let deltaScale = 0.25
    let lastUpdatedScale = 0.15

    if (!props.appearance.showDelta) {
      mainScale += 0.175
      lastUpdatedScale += 0.075
    }
    if (!props.appearance.showLastUpdated) {
      mainScale += 0.1
      deltaScale += 0.05
    }

    // status

    let main = height * mainScale

    let scale = 1

    if (main * 4 >= width) {
      main = width / 4
      scale = main / (height * mainScale)
    }

    // delta
    const delta = height * deltaScale * scale

    // last updated
    const lastUpdated = height * lastUpdatedScale * scale

    return {
      main,
      delta,
      lastUpdated,
    }
  }, [props.appearance.width, props.appearance.height])

  const status = statusQuery.data

  const isLoading = settingsQuery.isLoading || statusQuery.isLoading
  const isError = settingsQuery.isError || statusQuery.isError
  const isFetching = settingsQuery.isFetching || statusQuery.isFetching

  if (isError) {
    if (isFetching) {
      return <Loader />
    }
    return (
      <div className="text-4xl text-center underline flex h-full justify-center items-center text-error">
        <X size={height} />
      </div>
    )
  } else if (isLoading) {
    return <Loader />
  } else if (!status) {
    return null
  }

  const statusColor = () => {
    const obj: {
      style?: React.CSSProperties
      className?: string
    } = {
      style: undefined,
      className: undefined,
    }

    let value: string

    switch (status.state) {
      case 'urgent':
        value = 'text-error'
        break
      case 'warn':
        value = 'text-warning'
        break
      case 'ok':
        value = 'text-gray-100'
        break
      default:
        value = 'text-gray-100'
        break
    }

    const overwrite = overwrites[status.state]

    if (overwrite.active) {
      obj.style = {
        color: overwrite.value,
      }
    } else {
      obj.className = value
    }

    return obj
  }

  const color = statusColor()

  return (
    <div
      style={color.style}
      className={`flex flex-col text-center select-none h-full overflow-hidden ${
        color.className || ''
      }`}
    >
      <div className="flex w-full flex-grow">
        <div className="w-8/12 flex justify-center items-center">
          <h1 style={{ fontSize: textSize.main }} className="font-extrabold">
            {status.value}
          </h1>
        </div>
        <div className="w-4/12 flex justify-center items-center">
          {status.direction && showDirection && (
            <DirectionIcon size={textSize.main} direction={status.direction} />
          )}
        </div>
      </div>

      {status.delta && showDelta && (
        <div className="font-bold">
          <span style={{ fontSize: textSize.delta }}>{status.deltaText}</span>
        </div>
      )}

      {showLastUpdated && (
        <div className="">
          <span
            style={{ fontSize: textSize.lastUpdated }}
            className="text-ellipsis"
          >
            {status.lastUpdatedText}
          </span>
        </div>
      )}
    </div>
  )
}

export default Status
