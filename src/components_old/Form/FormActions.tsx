import {
  IconCopy,
  IconDeviceFloppy,
  IconRestore,
  IconTrash,
} from '@tabler/icons-react'

export interface FormActionsProps {
  duplicate?: () => void
  remove?: () => void
  form: any
}

export function FormActions(props: FormActionsProps) {
  const { duplicate, remove, form } = props

  return (
    <div className="w-full flex justify-end">
      <ul className="menu menu-horizontal bg-base-200 rounded-box">
        <li>
          <button
            className="btn btn-sm tooltip"
            type="button"
            data-tip="Duplicate"
            onClick={duplicate}
          >
            <IconCopy />
          </button>
        </li>

        <li>
          <button
            className="btn btn-sm tooltip"
            type="button"
            data-tip="Delete"
            onClick={remove}
          >
            <IconTrash />
          </button>
        </li>
        <li>
          <button
            className="btn btn-sm tooltip"
            type="button"
            data-tip="Reset"
            onClick={() => {
              form.reset()
            }}
          >
            <IconRestore />
          </button>
        </li>
        <li>
          <button
            className="btn btn-sm tooltip"
            data-tip="Save"
            type="submit"
            disabled={!form.formState.isDirty}
          >
            <IconDeviceFloppy />
          </button>
        </li>
      </ul>
    </div>
  )
}
