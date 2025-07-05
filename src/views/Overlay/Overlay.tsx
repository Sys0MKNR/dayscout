import { useForm } from '@mantine/form'

import { useMutation, useQuery } from '@tanstack/react-query'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { OverlayForm } from '../../components/OverlayForm'
import { settings } from '../../lib/settings'
import { type IOverlaySchema, OverlaySchema } from '../../lib/types'

export function OverlayView() {
  const params = useParams()

  const query = useQuery({
    queryKey: ['window', params.id],
    queryFn: () =>
      params.id ? settings.overlays.getOne(params.id) : undefined,
    retry: 1,
  })

  const form = useForm<IOverlaySchema>({
    mode: 'uncontrolled',
    validate: zod4Resolver(OverlaySchema),
  })

  const mutation = useMutation({
    mutationFn: async (values: IOverlaySchema) =>
      settings.overlays.setOne(values),
  })

  const navigate = useNavigate()

  const remove = useMemo(() => {
    return async () => {
      if (query.data?.id) {
        await settings.overlays.removeOne(query.data.id)
        await navigate('/')
      }
    }
  }, [query.data, navigate])

  return (
    <OverlayForm
      form={form}
      query={query}
      mutation={mutation}
      formActions={{ remove }}
    />
  )
}
