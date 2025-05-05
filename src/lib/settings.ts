import {
  IListSettingsSchema,
  IListSettingsSchemaKey,
  ISettingsSchema,
  ISettingsSchemaKey,
  isListSetting,
  ListSettingsSchema,
  SettingsSchema,
} from '@/types/settings'
import { Store } from 'tauri-plugin-store-api'
import { deepmerge } from 'deepmerge-ts'
import { findAndRemove } from './utils'

export const store = new Store('.settings.json')

async function get<T extends ISettingsSchemaKey>(
  key: T,
  opts: {
    unsafe?: boolean
  } = {}
) {
  const { unsafe = false } = opts

  const data = (await store.get<string>(key)) || undefined

  if (unsafe) {
    return data as any
  }

  return SettingsSchema.shape[key].parse(data) as ISettingsSchema[T]
}

async function set<T extends ISettingsSchemaKey>(key: T, data: any) {
  return store.set(key, SettingsSchema.shape[key].parse(data))
}

async function listSet<T extends IListSettingsSchemaKey>(key: T, data: any) {
  const arr: ISettingsSchema[T] = await get<T>(key)

  const [entry, rest] = findAndRemove(arr, 'id', data.id)
  const fullData = entry ? deepmerge(entry, data) : data
  const safeData = ListSettingsSchema.shape[key].parse(fullData)

  return store.set(key, [safeData, ...rest])
}

async function remove<T extends ISettingsSchemaKey>(key: T) {
  return store.delete(key)
}

async function listRemove<T extends IListSettingsSchemaKey>(key: T, data: any) {
  const arr: IListSettingsSchema[T][] = await get<T>(key)

  const entry = findAndRemove(arr, 'id', data.id)
  const fullData = entry ? deepmerge(entry, data) : data
  const safeData = ListSettingsSchema.shape[key].parse(fullData)

  return store.set(key, [safeData, ...arr])
}

// async function listDelete<T>(
//   key: string,
//   value: string,
//   subkey: string = 'id'
// ) {
//   const data = (await store.get(key)) as T

//   if (!Array.isArray(data)) {
//     throw new Error(`Key ${key} is not a list`)
//   }
//   return store.set(arr.filter((d: any) => d.id !== key))
// }

async function reset(key?: ISettingsSchemaKey) {
  if (key) {
    return store.delete(key)
  }

  return store.clear()
}

async function load() {
  return store.load()
}

export const settings = {
  get,
  listGet,
  set,
  listSet,
  reset,
  load,
  remove,
  listRemove,
}

export class BadRequestError extends Error {
  status_code = 400
  status = 'Bad Request'
}

export class NotFoundError extends Error {
  status_code = 404
  status = 'Not Found'
}
