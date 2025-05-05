import { ActionsGrid, LinkActionCard } from '@comp/ActionsGrid'
import { Card, Center, Flex, Text } from '@mantine/core'
import { IconAppWindow, IconHome, IconUserCircle } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

const groups = [
  {
    title: 'General',
    to: '/settings/general',
    icon: <IconHome size={24} />,
  },
  {
    title: 'Profiles',
    to: '/settings/profile',
    icon: <IconUserCircle size={24} />,
  },
  {
    title: 'Windows',
    to: '/settings/window',
    icon: <IconAppWindow size={24} />,
  },
]

export function SettingsIndexView() {
  return (
    <ActionsGrid>
      {groups.map((group) => (
        <LinkActionCard
          key={group.title}
          to={group.to}
          icon={group.icon}
          title={group.title}
        />
      ))}
    </ActionsGrid>
    // <Flex h={'100%'} justify={'center'} align={'center'}>
    //   <Card
    //     w={'7em'}
    //     h={'7em'}
    //     shadow="sm"
    //     padding="xl"
    //     component={Link}
    //     to="general"
    //   >
    //     General
    //   </Card>
    // </Flex>

    // <div className="flex flex-wrap gap-6 h-full justify-center items-center ">
    //   <Link to={'/settings/general'}>
    //     <div className="card w-32 h-32 bg-base-100 shadow-xl btn p-0">
    //       <h2 className="card-title">General</h2>
    //     </div>
    //   </Link>
    //   <Link to={'/settings/profile'}>
    //     <div className="card w-32 h-32 bg-base-100 shadow-xl btn p-0">
    //       <h2 className="card-title">Profiles</h2>
    //     </div>
    //   </Link>

    //   <Link to={'/settings/window'}>
    //     <div className="card w-32 h-32 bg-base-100 shadow-xl btn p-0">
    //       <h2 className="card-title">Windows</h2>
    //     </div>
    //   </Link>
    // </div>
  )
}
