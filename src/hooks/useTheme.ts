import { settings } from '@/state/settings'
import { IProfileSchema } from '@/types/profile'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

interface UseThemeProps {
  getProfile: (id: string) => IProfileSchema
}

export function useTheme(props: UseThemeProps) {
  let [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    console.log('theme update')
    const html = document.querySelector('html')

    const profileId = searchParams.get('profile')

    if (!profileId) {
      return
    }

    let p = props.getProfile(profileId)

    console.log('profile', p)

    if (!p) {
      return
    }

    html?.setAttribute('data-theme', p.appearance.theme)
  }, [props.getProfile, searchParams])
}
