import { validate, ValidationError } from '@/lib/utils'
import { useState } from 'react'
import { z, ZodType } from 'zod'

export function useValidate<T extends ZodType, U extends z.infer<T>>(
  schema: T
) {
  const [data, setData] = useState<U | null>(null)
  const [errors, setErrors] = useState<ValidationError<T> | null>(null)
  const [success, setSuccess] = useState(false)

  const _validate = (newData: U) => {
    const res = validate(schema, newData)
    setData(res.data || null)
    setErrors(res.error)
    setSuccess(res.success)
  }

  return { data, errors, success, validate: _validate }
}
