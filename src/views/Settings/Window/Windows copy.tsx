import { useCreateNew } from '@/hooks/useActions'
import { settings } from '@/state/settings'
import { IconPlus } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'

export function WindowsView() {
  const window = useSnapshot(settings.state.data.window)

  const { profileMap } = useSnapshot(settings.$)

  const createNew = useCreateNew('window')
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="table bg-base-100">
        <thead>
          <tr>
            <th>Name</th>
            <th>Profile</th>
            <th>Display</th>
            <th>Enabled</th>
            <th className="w-2">
              <button
                className="btn btn-square btn-outline btn-sm"
                onClick={createNew}
              >
                <IconPlus size={16} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {window.map((row, _i) => {
            const p = (row.profile && profileMap[row.profile]?.name) || ''

            return (
              <tr
                key={row.id}
                className="hover cursor-pointer"
                onClick={() => navigate(row.id)}
              >
                <td>{row.name}</td>
                <td>{p}</td>
                <td>{row.monitor}</td>
                <td>{row.enabled ? 'Yes' : 'No'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
