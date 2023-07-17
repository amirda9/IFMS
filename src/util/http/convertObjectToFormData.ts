export type FormDataValueType =
  | string
  | number
  | null
  | boolean
  | Array<File | string | number | boolean | null>
  | File;
export const convertObjectToFormData = (
  ob?: Record<string, FormDataValueType>,
): FormData | undefined => {
  if (!ob) {
    return undefined
  }
  const formData = new FormData()

  Object.entries(ob).forEach(([key, value]) => {
    appendToFormData(key, value, formData)
  })

  return formData
}

export const appendToFormData = (
  key: string,
  value: FormDataValueType,
  formData: FormData,
) => {
  if (value === undefined) {
    return
  }
  if (typeof value !== 'object' || value === null) {
    formData.append(key, value as string)
  } else if (Array.isArray(value)) {
    appendArrayToFormData(key, value, formData)
  } else {
    formData.append(key, value)
  }
}
export const appendArrayToFormData = (
  key: string,
  array: Array<string | number | File | null | boolean>,
  formData: FormData,
) => {
  array.forEach(value => {
    appendToFormData(key, value, formData)
  })
}
