import { useForm } from 'react-hook-form'
import { useLoaderData, useNavigate } from 'react-router'
import { OverlayForm } from '../../components/OverlayForm'
import { setOverlay } from '../../lib/api'
import type { Overlay } from '../../lib/types'

export function OverlayView() {
  const { overlay } = useLoaderData()

  const form = useForm<Overlay>({
    mode: 'onSubmit',
    defaultValues: overlay,
  })

  const onSubmit = async (values: Overlay) => {
    console.log('onSubmit', values)
    await setOverlay(values)
  }

  const navigate = useNavigate()

  // const remove = useMemo(() => {
  //   return async () => {
  //     // if (query.data?.id) {
  //     //   await settings.overlays.removeOne(query.data.id)
  //     //   await navigate('/')
  //     // }
  //   }
  // }, [query.data, navigate])

  // return 'lul'

  return (
    <OverlayForm
      form={form}
      onSubmit={onSubmit}
      onReset={() => form.reset()}
      onBack={() => navigate('/', { viewTransition: true })}
    />
  )
}
