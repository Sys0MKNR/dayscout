import { useEffect, useRef } from 'react'

interface ModalProps {
  children: React.ReactNode
  open: boolean
}

export function Modal(props: ModalProps) {
  const { children, open } = props

  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (open) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }
  }, [open])

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <div>{children}</div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}
