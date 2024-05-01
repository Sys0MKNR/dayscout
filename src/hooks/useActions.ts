import { settings } from '@/state/settings'
import { ISettingsSchemaBase } from '@/types/settings'
import { useEffect } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export function useDuplicate(t: keyof ISettingsSchemaBase, id: string) {
  const navigate = useNavigate()

  return () => {
    const obj = settings.duplicate(t, id)
    if (!obj) {
      return
    }

    navigate('../' + obj.id)
  }
}

export function useRemove(t: keyof ISettingsSchemaBase, id: string) {
  const navigate = useNavigate()

  return () => {
    settings.remove(t, id)
    navigate(-1)
  }
}

export function useOnValid<
  T extends keyof ISettingsSchemaBase,
  U extends Partial<ISettingsSchemaBase[T]>,
>(t: T, id: string, form: any): SubmitHandler<U> {
  const navigate = useNavigate()

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset(form.getValues())
    }
  }, [form.formState.isSubmitSuccessful])

  return async (values: U) => {
    settings.update(t, id, values)
    navigate('.', { replace: true })
  }
}

export function useCreateNew<T extends keyof ISettingsSchemaBase>(t: T) {
  const navigate = useNavigate()

  return () => {
    const defaults = {
      window: {},
      profile: {},
    }

    const obj = settings.create(t, { name: 'new ' + t, ...defaults[t] } as any)
    navigate(`/settings/${t}/${obj.id}`)
  }
}
