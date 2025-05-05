import { Card, Text, SimpleGrid, UnstyledButton, Group } from '@mantine/core'
import classes from './ActionsGrid.module.css'
import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

interface ActionCardProps {
  title: string
  icon: ReactNode
  to: string
}

export function LinkActionCard(props: ActionCardProps) {
  const { title, icon, to } = props
  return (
    <UnstyledButton
      key={title}
      className={classes.item}
      component={Link}
      to={to}
    >
      {icon}
      <Text size="xs" mt={7}>
        {title}
      </Text>
    </UnstyledButton>
  )
}

interface ActionsGridProps {
  children: ReactNode
  label?: string
}

export function ActionsGrid(props: ActionsGridProps) {
  const { children, label } = props

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group justify="space-between">
        <Text className={classes.title}>{label}</Text>
      </Group>
      <SimpleGrid cols={3} mt="md">
        {children}
      </SimpleGrid>
    </Card>
  )
}
