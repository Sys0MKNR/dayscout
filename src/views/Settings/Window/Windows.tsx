import { useEffect, useMemo, useState } from 'react'
import {
  MRT_EditActionButtons,
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMantineReactTable,
  createRow,
} from 'mantine-react-table'
import {
  ActionIcon,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { modals } from '@mantine/modals'
import {
  IconEdit,
  IconPlus,
  IconReload,
  IconRestore,
  IconTrash,
  IconZoomReset,
} from '@tabler/icons-react'
import { IWindowSchema, WindowSchema } from '@/types/window'
import { useCreate, useGet } from '@/hooks/useSettings'
import { settings } from '@/lib/settings'
import { v4 as uuidv4 } from 'uuid'
import { EditCheckbox } from '@comp/EditCheckbox'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'

export function WindowsView() {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({})

  const form = useForm<IWindowSchema>({
    mode: 'uncontrolled',
    validate: zodResolver(WindowSchema),

    // validateInputOnChange: true,
  })

  useEffect(() => {
    setValidationErrors(form.errors as any)
  }, [form.errors])

  console.log(form)

  const columns = useMemo<MRT_ColumnDef<IWindowSchema>[]>(
    () => [
      // {
      //   accessorKey: 'id',
      //   header: 'Id',
      //   enableEditing: false,
      // },
      {
        accessorKey: 'name',
        header: 'Name',
        mantineEditTextInputProps: {
          type: 'name',
          required: true,
          error: validationErrors.name,
          onFocus: () => form.clearFieldError('name'),
        },
        size: 250,
      },
      {
        accessorKey: 'profile',
        header: 'Profile',
        editVariant: 'select',
        mantineEditSelectProps: {
          data: ['p1', 'p2'],
          error: validationErrors.profile,
        },
        size: 125,
      },

      {
        accessorKey: 'monitor',
        header: 'Monitor',
        editVariant: 'select',
        mantineEditSelectProps: {
          data: ['p1', 'p2'],
          error: validationErrors.monitor,
        },
        size: 125,
      },
      {
        accessorKey: 'enabled',
        header: 'Enabled',
        mantineEditSelectProps: {
          error: validationErrors.enabled,
        },
        Edit: (props) => <EditCheckbox {...props} />,
      },
    ],
    [validationErrors]
  )

  //call CREATE hook
  const { mutateAsync: create, isPending: isCreating } = useCreate('window')

  const {
    data: fetchedWindows = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoading,
  } = useGet('window')

  console.log(fetchedWindows)

  //CREATE action
  const handleCreateUser: MRT_TableOptions<IWindowSchema>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      values = { ...values, id: uuidv4(), enabled: true }
      form.setValues(values)
      form.validate()

      const res = form.validate()

      if (res.hasErrors) {
        return
      }

      await create(form.getValues())
      exitCreatingMode()
    }

  //UPDATE action
  const handleSaveUser: MRT_TableOptions<IWindowSchema>['onEditingRowSave'] =
    async ({ values, table }) => {
      // const newValidationErrors = validateUser(values)
      // if (Object.values(newValidationErrors).some((error) => error)) {
      //   setValidationErrors(newValidationErrors)
      //   return
      // }
      // setValidationErrors({})
      // await updateUser(values)
      // table.setEditingRow(null) //exit editing mode
    }

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<IWindowSchema>) =>
    modals.openConfirmModal({
      title: 'Are you sure you want to delete this Window?',
      children: (
        <Text>
          Are you sure you want to delete {row.original.name}? This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      // onConfirm: () => deleteUser(row.original.id),
    })

  const table = useMantineReactTable({
    columns,
    data: fetchedWindows,
    createDisplayMode: 'row', //default ('row', and 'custom' are also available)
    editDisplayMode: 'table', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    enableToolbarInternalActions: false,
    enableFilters: false,
    enableSorting: false,
    enableColumnActions: false,
    getRowId: (row) => row.id,
    enablePagination: false,
    enableRowSelection: true,
    initialState: {
      pagination: {
        pageSize: 0,
        pageIndex: 0,
      },
    },
    mantineToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'red',
          children: 'Error loading data',
        }
      : undefined,
    mantineTableContainerProps: {
      style: {},
    },

    defaultColumn: {
      minSize: 0, //allow columns to get smaller than default
      maxSize: 1000, //allow columns to get larger than default
      size: 1, //make columns wider by default
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Create New IWindowSchema</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit IWindowSchema</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderRowActions: ({ row, table }) => (
      <Flex gap="md" justify={'flex-end'}>
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbar: ({ table }) => {
      return (
        <Group justify="flex-end">
          <ActionIcon
            onClick={() => {
              settings.load()
            }}
          >
            <IconReload />
          </ActionIcon>
          <ActionIcon
            onClick={() => {
              settings.reset()
            }}
          >
            <IconRestore />
          </ActionIcon>
          <ActionIcon
            m={'sm'}
            size={'lg'}
            onClick={() => {
              table.setCreatingRow(true)
              //   createRow(table, {
              //     id: uuidv4(),
              //     name: '',
              //     enabled: true,
              //   })
              // )
            }}
          >
            <IconPlus />
          </ActionIcon>
        </Group>
      )
    },

    state: {
      isLoading: isLoading,
      isSaving: isCreating,
      // isSaving: isCreating || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  })

  return <MantineReactTable table={table} />
}

// //CREATE hook (post new IWindowSchema to api)
// function useCreateUser() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async (window: IWindowSchema) => {
//       //send api update request here
//       await new Promise((resolve) => setTimeout(resolve, 1000)) //fake api call
//       return Promise.resolve()
//     },
//     //client side optimistic update
//     onMutate: (newUserInfo: IWindowSchema) => {
//       queryClient.setQueryData(
//         ['users'],
//         (prevUsers: any) =>
//           [
//             ...prevUsers,
//             {
//               ...newUserInfo,
//               id: (Math.random() + 1).toString(36).substring(7),
//             },
//           ] as IWindowSchema[]
//       )
//     },
//     onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
//   })
// }

// function useGet() {
//   return useQuery<IWindowSchema[]>({
//     queryKey: ['users'],
//     queryFn: async () => {
//       //send api request here
//       await new Promise((resolve) => setTimeout(resolve, 1000)) //fake api call
//       return Promise.resolve(fakeData)
//     },
//     refetchOnWindowFocus: false,
//   })
// }

// //UPDATE hook (put IWindowSchema in api)
// function useUpdateUser() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async (IWindowSchema: IWindowSchema) => {
//       //send api update request here
//       await new Promise((resolve) => setTimeout(resolve, 1000)) //fake api call
//       return Promise.resolve()
//     },
//     //client side optimistic update
//     onMutate: (newUserInfo: IWindowSchema) => {
//       queryClient.setQueryData(['users'], (prevUsers: any) =>
//         prevUsers?.map((prevUser: IWindowSchema) =>
//           prevUser.id === newUserInfo.id ? newUserInfo : prevUser
//         )
//       )
//     },
//     // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
//   })
// }

// //DELETE hook (delete IWindowSchema in api)
// function useDeleteUser() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async (userId: string) => {
//       //send api update request here
//       await new Promise((resolve) => setTimeout(resolve, 1000)) //fake api call
//       return Promise.resolve()
//     },
//     //client side optimistic update
//     onMutate: (userId: string) => {
//       queryClient.setQueryData(['users'], (prevUsers: any) =>
//         prevUsers?.filter(
//           (IWindowSchema: IWindowSchema) => IWindowSchema.id !== userId
//         )
//       )
//     },
//     // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
//   })
// }
