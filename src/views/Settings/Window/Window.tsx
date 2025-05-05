import { useDuplicate, useUpdate, useRemove } from '@/hooks/useActions'
import { settings } from '@/state/settings'
import { IWindowSchema, WindowSchema } from '@/types/window'
import { FormActions } from '@/components_old/Form/FormActions'
import { FormGroup } from '@/components_old/FormGroup'
import { zodResolver } from '@hookform/resolvers/zod'
import { Monitor, availableMonitors } from '@tauri-apps/api/window'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useSnapshot } from 'valtio'

export function WindowView() {
  const { id } = useParams()

  const [window, setWindow] = useState<IWindowSchema | null | false>(null)
  const [monitors, setMonitors] = useState<Monitor[]>([])

  const load = async () => {
    const monitors = await availableMonitors()

    if (!id) {
      return
    }

    const w = settings.get('window', id)

    if (!w) {
      return
    }

    setWindow(w)
    setMonitors(monitors)
  }

  useEffect(() => {
    load()
  }, [id])

  if (window === null) {
    return null
  } else if (window === false) {
    return <div>Not Found</div>
  }

  return <Window window={window} monitors={monitors} />
}

interface WindowProps {
  window: IWindowSchema
  monitors: Monitor[]
}

function Window(props: WindowProps) {
  const { window, monitors } = props

  const profiles = useSnapshot(settings.state.data.profile)

  const form = useForm<IWindowSchema>({
    resolver: zodResolver(WindowSchema),
    values: window,
  })

  const duplicate = useDuplicate('window', window.id)
  const remove = useRemove('window', window.id)
  const onValid = useUpdate('window', window.id, form)

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid)}>
        <FormActions duplicate={duplicate} remove={remove} form={form} />

        <div className="flex gap-4 flex-col overflow-y-auto h-[calc(100vh-208px)] pr-4">
          <FormGroup name="General" className="flex-col">
            <div className="join">
              <label className="input input-bordered join-item input-sm w-24">
                Name
              </label>
              <input
                className="input input-bordered join-item input-sm w-full"
                type="text"
                autoComplete="off"
                {...form.register('name')}
              />
            </div>

            <div className="join">
              <label className="input input-bordered join-item input-sm w-24">
                Profile
              </label>
              <select
                className="select select-bordered w-full join-item select-sm"
                {...form.register('profile')}
              >
                <option></option>

                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="join">
              <label className="input input-bordered join-item input-sm w-24">
                Monitor
              </label>

              <select
                className="select select-bordered w-full join-item select-sm"
                {...form.register('monitor')}
              >
                <option></option>
                {monitors.map((monitor) => (
                  <option key={monitor.name}>{monitor.name}</option>
                ))}
              </select>
            </div>

            <div className="join">
              <label className="input input-bordered join-item input-sm w-24">
                Enabled
              </label>

              <div className="w-full">
                <input
                  className="checkbox join-item checkbox-lg "
                  type="checkbox"
                  {...form.register('enabled')}
                />
              </div>
            </div>
          </FormGroup>
        </div>
      </form>
    </FormProvider>
  )
}
