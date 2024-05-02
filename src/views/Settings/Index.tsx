import { Link } from 'react-router-dom'

export function SettingsIndexView() {
  return (
    <div className="flex flex-wrap gap-6 h-full justify-center items-center ">
      <Link to={'/settings/general'}>
        <div className="card w-32 h-32 bg-base-100 shadow-xl btn p-0">
          <h2 className="card-title">General</h2>
        </div>
      </Link>
      <Link to={'/settings/profile'}>
        <div className="card w-32 h-32 bg-base-100 shadow-xl btn p-0">
          <h2 className="card-title">Profiles</h2>
        </div>
      </Link>

      <Link to={'/settings/window'}>
        <div className="card w-32 h-32 bg-base-100 shadow-xl btn p-0">
          <h2 className="card-title">Windows</h2>
        </div>
      </Link>
    </div>
  )
}
