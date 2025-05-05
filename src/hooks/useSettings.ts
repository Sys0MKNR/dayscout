import { settings } from '@/lib/settings'
import {
  IListSettingsSchema,
  ISettingsSchema,
  ISettingsSchemaKey,
} from '@/types/settings'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useGet<T extends ISettingsSchemaKey>(key: T) {
  return useQuery<ISettingsSchema[T]>({
    queryKey: [key],
    queryFn: async () => {
      return settings.get<T>(key)
    },
    refetchOnWindowFocus: false,
  })
}

// export function useGetFromList<T>(key: string, id: string) {
//   return useQuery<T[]>({
//     queryKey: [key, id],
//     queryFn: async () => {
//       return settings.listGet<T>(key, id)
//     },
//     refetchOnWindowFocus: false,
//   })
// }

export function useCreate<
  T extends keyof IListSettingsSchema,
  U extends IListSettingsSchema[T],
>(key: T) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: U) => {
      return settings.listSet(key, data)
    },
    onMutate: (newData: U) => {
      queryClient.setQueryData(
        [key],
        (prevData: any = []) => [newData, ...prevData] as U[]
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: [key] }),
  })
}

export function useDelete<
  T extends keyof IListSettingsSchema,
  U extends IListSettingsSchema[T],
>(key: T) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: U) => {
      return settings.listSet(key, data)
    },
    onMutate: (newData: U) => {
      queryClient.setQueryData(
        [key],
        (prevData: any = []) => [newData, ...prevData] as U[]
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: [key] }),
  })
}
