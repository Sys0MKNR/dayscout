import { useOnValid, useUpdate } from '@/hooks/useActions'
import { settings } from '@/state/settings'
import { GeneralSchema, IGeneralSchema } from '@/types/settings'
import { Themes } from '@/types/utils'
import { FormActions } from '@comp/Form/FormActions'
import { FormField } from '@comp/Form/FormField'
import { FormGroup } from '@comp/FormGroup'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { useSnapshot } from 'valtio'

export function GeneralSettingsView() {
  const snap = useSnapshot(settings.state.data)

  const form = useForm<IGeneralSchema>({
    resolver: zodResolver(GeneralSchema),
    values: snap.general,
  })

  const onValid = useOnValid(form, (values) => {
    settings.state.data.general = Object.assign(
      settings.state.data.general,
      values
    )
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)}>
        <FormActions form={form} />

        <div className="flex gap-4 flex-col overflow-y-auto h-[calc(100vh-208px)] pr-4">
          <FormGroup name="General" className="flex-col">
            <div className="join">
              <label className="input input-bordered join-item input-sm w-24">
                Theme
              </label>
              <select
                className="select select-bordered w-full join-item select-sm"
                {...form.register('theme')}
              >
                {Themes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </FormGroup>
        </div>
      </form>
    </FormProvider>
  )
}
