import { useForm } from 'react-hook-form'
import { RouteObject, useNavigate } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
import { OverlayForm } from '../../components/OverlayForm'

import { api } from '../../../lib/api'
import { Overlay } from '../../../lib/types'

export const OverlayNewRoute = {
  path: 'overlay/new',
  handle: {
    crumb: 'New Overlay',
  },
  element: <OverlayNewView />,
  loader: api.additionalData.load,
} satisfies RouteObject

export function OverlayNewView() {
  const form = useForm<Overlay>({
    mode: 'onSubmit',
    defaultValues: {
      id: uuidv4(),
      name: 'Overlay',
      enabled: true,
      allMonitors: true,
      monitors: [],
      url: 'http://localhost:8080',
      token: '',
      fetchInterval: 2,
      thresholds: {
        high: '',
        targetBottom: '',
        low: '',
        targetTop: '',
      },
      position: 'Preset',
      customPosition: {
        x: 0,
        y: 0,
      },
      presetPosition: '1',
      width: 200,
      height: 200,
      interactive: false,
      opacity: 70,
      padding: 12,
      transparent: false,
      font: 'Verdana',
      colors: {
        urgent: '#ff8787',
        warn: '#ffd43b',
        ok: '#c9c9c9',
        background: '#424242',
      },
      statusItems: {
        value: {
          enabled: true,
          size: 55,
        },
        icon: {
          enabled: true,
          size: 75,
        },
        delta: {
          enabled: true,
          size: 30,
        },
        lastUpdated: {
          enabled: true,
          size: 15,
        },
      },
    },
  })

  const navigate = useNavigate()

  const onSubmit = async (values: Overlay) => {
    await api.overlay.set(values)
    navigate(`/overlay/${values.id}`, {
      replace: true,
      viewTransition: true,
    })
  }
  return <OverlayForm form={form} saveAlwaysEnabled onSubmit={onSubmit} />
}
