import { useOnValid, useUpdate } from '@/hooks/useActions'
import { settings } from '@/state/settings'
import { GeneralSchema, IGeneralSchema } from '@/types/settings'
import { Themes } from '@/types/utils'
import { FormActions } from '@/components_old/Form/FormActions'
import { FormField } from '@/components_old/Form/FormField'
import { SelectInput, TextInput } from '@/components_old/Form/Input'
import { FormGroup } from '@/components_old/FormGroup'
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
            <TextInput name="name"></TextInput>

            <SelectInput name="theme">
              {Themes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectInput>

            <SelectInput name="defaultProfile">
              {Themes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectInput>
          </FormGroup>
        </div>
      </form>
    </FormProvider>
  )
}
