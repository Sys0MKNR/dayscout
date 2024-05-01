import { settings } from '@/state/settings'
import { useEffect } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useSnapshot } from 'valtio'

export function ThemeProvider() {
  const [searchParams, _setSearchParams] = useSearchParams()

  const profile = useSnapshot(settings.state.data.profile)

  useEffect(() => {
    const html = document.querySelector('html')

    const profileId = searchParams.get('profile')

    let p = null
    if (profileId) {
      p = settings.get('profile', profileId)
    } else {
      p = profile[0]
    }

    if (!p) {
      return
    }

    html?.setAttribute('data-theme', p.appearance.theme)
  }, [profile, searchParams])

  return <Outlet></Outlet>
}
