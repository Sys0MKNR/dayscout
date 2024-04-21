import { settings } from '@/state/settings'
import { useEffect } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { useSnapshot } from 'valtio'

export function ThemeProvider() {
  let [searchParams, setSearchParams] = useSearchParams()

  const profile = useSnapshot(settings.state.data.profile)

  useEffect(() => {
    console.log('theme update')
    const html = document.querySelector('html')

    const profileId = searchParams.get('profile')

    let p = null
    if (profileId) {
      p = settings.get('profile', profileId)
    } else {
      p = profile[0]
    }

    console.log('profile', p)

    if (!p) {
      return
    }

    html?.setAttribute('data-theme', p.appearance.theme)
  }, [profile, searchParams])

  return <Outlet></Outlet>
}
