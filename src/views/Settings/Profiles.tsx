import { settings } from '@/state/settings'
import { IconPlus } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'

export function ProfilesView() {
  const profiles = useSnapshot(settings.state.data.profile)

  console.log('profiles', profiles)

  const navigate = useNavigate()

  const create = async () => {
    const p = await settings.create('profile')
    navigate(p.id)
  }

  return (
    <div className="overflow-x-auto">
      <table className="table bg-base-100">
        <thead>
          <tr>
            <th>Name</th>
            <th className="w-2">
              <button
                className="btn btn-square btn-outline btn-sm"
                onClick={create}
              >
                <IconPlus size={16} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((row, _) => (
            <tr
              key={row.id}
              className="hover cursor-pointer"
              onClick={() => navigate(row.id)}
            >
              <td>{row.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
