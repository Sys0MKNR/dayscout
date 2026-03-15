import { useForm } from 'react-hook-form'
import { RouteObject, useLoaderData, useRevalidator } from 'react-router'
import { OverlayForm } from '../../components/OverlayForm'
import { Overlay } from '../../../lib/types'
import { api } from '../../../lib/api'

export const OverlayRoute = {
  path: 'overlay/:id',
  handle: {
    crumb: 'Overlay',
  },
  element: <OverlayView />,
  loader: async ({ params }) => {
    if (!params.id) {
      throw new Error('Overlay ID is required')
    }

    const overlay = await api.overlay.get(params.id)
    const additionalData = await api.additionalData.load()
    return {
      overlay,
      ...additionalData,
    }
  },
} satisfies RouteObject

function OverlayView() {
  const { overlay } = useLoaderData<typeof OverlayRoute.loader>()

  const revalidator = useRevalidator()

  const form = useForm<Overlay>({
    mode: 'onSubmit',
    defaultValues: overlay,
  })

  const onSubmit = async (values: Overlay) => {
    await api.overlay.set(values)
    await revalidator.revalidate()
    form.reset(values)
  }

  return <OverlayForm form={form} onSubmit={onSubmit} />
}
