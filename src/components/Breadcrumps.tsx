import { useMatches, useNavigate, useParams } from 'react-router-dom'

import type { UIMatch } from 'react-router-dom'

import { ReactNode } from 'react'
import { IconCaretLeft } from '@tabler/icons-react'

interface Handle {
  crumb: (data: any, params: any) => ReactNode
}

export function Breadcrumbs() {
  const navigate = useNavigate()

  const params = useParams()

  const matches = useMatches() as UIMatch<any, Handle>[]
  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => match.handle.crumb(match.data, params))

  return (
    <div className="breadcrumbs bg-primary-content p-4">
      <ul>
        {crumbs.length > 1 && (
          <IconCaretLeft
            className="cursor-pointer mr-4"
            size={24}
            onClick={() => navigate(-1)}
          />
        )}

        {crumbs.map((crumb, index) => (
          <li key={index}>{crumb}</li>
        ))}
      </ul>
    </div>
  )
}
