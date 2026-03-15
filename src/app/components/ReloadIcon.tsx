import { ActionIcon, Tooltip } from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'
import cx from 'clsx'
import { useSnapshot } from 'valtio'
import { reloadOverlayState, reloadOverlays } from '../state'
import classes from './ReloadIcon.module.css'

export function ReloadIcon() {
  const snap = useSnapshot(reloadOverlayState)

  return (
    <Tooltip label="Reload">
      <ActionIcon
        variant="filled"
        aria-label="Reload"
        onClick={() => reloadOverlays()}
        color={snap.error ? 'red' : undefined}
      >
        <IconRefresh
          className={cx({
            [classes.loading]: snap.loading,
            [classes.error]: Boolean(snap.error),
          })}
        />
      </ActionIcon>
    </Tooltip>
  )
}
