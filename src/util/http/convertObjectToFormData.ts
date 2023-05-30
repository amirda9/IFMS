import {Asset} from 'react-native-image-picker';

export type FormDataValueType =
  | string
  | number
  | null
  | boolean
  | Array<Asset | string | number | boolean | null>
  | Asset;
export const convertObjectToFormData = (
  ob?: Record<string, FormDataValueType>,
): FormData | undefined => {
  if (!ob) {
    return undefined;
  }
  const formData = new FormData();

  Object.entries(ob).forEach(([key, value]) => {
    appendToFormData(key, value, formData);
  });

  return formData;
};

export const appendToFormData = (
  key: string,
  value: FormDataValueType,
  formData: FormData,
) => {
  if (value === undefined) {
    return;
  }
  if (typeof value !== 'object' || value === null) {
    formData.append(key, value);
  } else if (Array.isArray(value)) {
    appendArrayToFormData(key, value, formData);
  } else {
    formData.append(key, {
      name: value.fileName,
      type: value.type,
      uri: value.uri,
    });
  }
};
export const appendArrayToFormData = (
  key: string,
  array: Array<string | number | Asset | null | boolean>,
  formData: FormData,
) => {
  array.forEach(value => {
    appendToFormData(key, value, formData);
  });
};
