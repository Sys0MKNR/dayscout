import { useForm } from '@mantine/form'

import { useMutation, useQuery } from '@tanstack/react-query'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { useNavigate } from 'react-router'
import { OverlayForm } from '../../components/OverlayForm'
import { settings } from '../../lib/settings'
import { type IOverlaySchema, OverlaySchema } from '../../lib/types'

export function OverlayNewView() {
  const query = useQuery({
    queryKey: ['window', 'new'],

    queryFn: () => settings.overlays.new(),
    gcTime: 0,
    retry: 1,
  })

  const form = useForm<IOverlaySchema>({
    mode: 'uncontrolled',
    validate: zod4Resolver(OverlaySchema),
  })

  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (values: IOverlaySchema) => {
      await settings.overlays.setOne(values)
      navigate(`/overlay/${values.id}`, {
        replace: true,
      })
    },
  })

  return (
    <OverlayForm
      form={form}
      query={query}
      mutation={mutation}
      saveAlwaysEnabled
      formActions={{
        reset: false,
      }}
    />
  )
}
