import { Suspense, useMemo } from 'react'

import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FormProvider,
  SubmitErrorHandler,
} from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'react-toastify'
import {
  ISettingsSchema,
  SettingsSchema,
  updateSettings,
  state,
} from '@/hooks/useSettings'
import { useSnapshot } from 'valtio'
import { getFromObj } from '@/lib/utils'
import SettingsItem from './SettingsItem'
import Loader from '@comp/Loader'
import { SettingsOpts } from './SettingsOpts'
import Autocomplete from '@comp/Autocomplete'
import { useState } from 'react'
import { Modal } from '@comp/Modal'
interface SettingsGroupProps {
  children: React.ReactNode
  name: string
}

const SettingsGroup = (props: SettingsGroupProps) => {
  return (
    <fieldset className="border border-solid border-primary p-3 mb-4 flex flex-wrap">
      <legend className="text-xl">{props.name}</legend>
      {props.children}
    </fieldset>
  )
}

function Settings() {
  const snap = useSnapshot(state)

  const [window, setWindow] = useState('')

  const options = useMemo(() => {
    const opts = SettingsOpts

    const s = snap.settings.find((s) => s.name === window)
    console.log(snap.settings)

    console.log(s, window)

    if (!s) {
      return []
    }

    for (const group of opts) {
      for (const option of group.children) {
        const val = getFromObj<string>(s, option.name)

        option.value = val as any
      }
    }

    return opts
  }, [snap.settings, window])

  const methods = useForm<ISettingsSchema>({
    resolver: zodResolver(SettingsSchema),
  })

  const onValid: SubmitHandler<ISettingsSchema> = async (data) => {
    const fn = async () => {
      await updateSettings(window, data)

      methods.reset(data)

      toast.success('Settings Saved', {
        position: 'bottom-left',
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        theme: 'colored',
        toastId: 'settings_saved',
        className: 'bg-success bg-base-content',
      })
    }

    fn()
  }

  const onError: SubmitErrorHandler<ISettingsSchema> = () => {}

  if (!options) {
    return <div>Loading...</div>
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="">
        <SettingsGroup key={'w'} name={'w'}>
          <Autocomplete
            items={['tset', 'tes']}
            createNew={true}
            className={'w-32'}
          ></Autocomplete>
        </SettingsGroup>
        <SettingsGroup key={'windows'} name={'Windows'}>
          <div className="w-full flex gap-4">
            <div className="grow">
              <select className="select select-bordered select-sm w-full ">
                <option disabled>{'Choose Window'}</option>

                {snap.settings.map((s) => {
                  return (
                    <option
                      key={s.name}
                      value={s.name}
                      onClick={() => {
                        setWindow(s.name)
                      }}
                    >
                      {s.name}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="join grow">
              <input
                className="input input-sm input-bordered join-item w-full"
                placeholder="New..."
              />
              <button className="btn join-item rounded-r-full btn-sm btn-primary">
                +
              </button>
            </div>
          </div>
        </SettingsGroup>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onValid, onError)}>
            {options.map((group) => {
              return (
                <SettingsGroup key={group.name} name={group.name}>
                  {group.children.map((item) => {
                    return <SettingsItem key={item.name} item={item} />
                  })}
                </SettingsGroup>
              )
            })}

            <div className="w-full sticky -bottom-5 py-3 flex justify-end bg-base-100">
              <button
                type="button"
                className="btn btn-accent text-base-100 mr-2"
                onClick={() => {
                  methods.reset(SettingsSchema.parse({}), {
                    keepDefaultValues: true,
                  })
                }}
              >
                Defaults
              </button>

              <button
                type="button"
                className="btn btn-accent text-base-100 mr-2"
                onClick={() => methods.reset()}
                disabled={!methods.formState.isDirty}
              >
                Reset
              </button>

              <button
                className="btn btn-primary text-base-100"
                disabled={!methods.formState.isDirty}
              >
                Save
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Suspense>
  )
}

export default Settings
