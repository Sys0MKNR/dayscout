import { useDuplicate, useOnValid, useRemove } from '@/hooks/useActions'
import { getFromObj } from '@/lib/utils'
import { settings } from '@/state/settings'
import { IProfileSchema, ProfileSchema } from '@/types/profile'
import { FormActions } from '@comp/Form/FormActions'
import { FormField } from '@comp/Form/FormField'
import { FormGroup } from '@comp/FormGroup'
import { SettingsOpts } from '@comp/Settings/SettingsOpts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useParams } from 'react-router-dom'

export function ProfileView() {
  const { id } = useParams()

  const [profile, setProfile] = useState<IProfileSchema | null | false>(null)

  const load = async () => {
    if (!id) {
      return
    }

    const p = settings.get('profile', id)

    if (!p) {
      return
    }

    setProfile(p)
  }

  useEffect(() => {
    load()
  }, [id])

  if (profile === null) {
    return null
  } else if (profile === false) {
    return <div>Not Found</div>
  }

  return <Profile profile={profile} />
}

interface ProfileProps {
  profile: IProfileSchema
}

export function Profile(props: ProfileProps) {
  const profile = props.profile

  const form = useForm<IProfileSchema>({
    resolver: zodResolver(ProfileSchema),
    values: profile,
  })

  const duplicate = useDuplicate('profile', profile.id)
  const remove = useRemove('profile', profile.id)
  const onValid = useOnValid('profile', profile.id, form)

  const options = useMemo(() => {
    const opts = SettingsOpts

    for (const group of opts) {
      for (const option of group.children) {
        const val = getFromObj<string>(profile, option.name)

        option.value = val as any
      }
    }

    return opts
  }, [profile])

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onValid, (e) => console.log(e))}>
        <FormActions duplicate={duplicate} remove={remove} form={form} />

        <div className="flex gap-4 flex-col overflow-y-auto h-[calc(100vh-208px)] pr-4">
          {options.map((group) => {
            return (
              <FormGroup key={group.name} name={group.name}>
                {group.children.map((item: any) => {
                  return <FormField key={item.name} item={item} />
                })}
              </FormGroup>
            )
          })}
        </div>
      </form>
    </FormProvider>
  )
}
