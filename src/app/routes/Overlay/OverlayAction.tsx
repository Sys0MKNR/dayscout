import { RouteObject } from 'react-router'
import { api } from '../../../lib/api'

export const OverlayActionRoutes = [
  {
    path: 'overlay/:id/enabled',
    action: async ({ params, request }) => {
      if (!params.id) {
        throw new Error('Overlay ID is required')
      }

      const formData = await request.formData()
      const enabled = formData.get('enabled') === 'true'

      await api.overlay.setEnabled(params.id, enabled)
    },
  },
  {
    path: 'overlay/:id/delete',
    action: async ({ params }) => {
      if (!params.id) {
        throw new Error('Overlay ID is required')
      }

      await api.overlay.delete(params.id)
    },
  },
] satisfies RouteObject[]
