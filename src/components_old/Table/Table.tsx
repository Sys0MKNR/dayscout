export function Table() {
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
          {profiles.map((row, _i) => (
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
