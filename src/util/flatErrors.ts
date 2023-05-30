type ErrorType = string | Array<ErrorType> | {[key in string]: ErrorType};

export const flatError = (errors: Array<[string, ErrorType]>): string[] => {
  return errors.flatMap(([_, error]) => convert(error)).flat(Infinity);
};

const convert = (error: ErrorType): string | string[] => {
  if (typeof error === 'string') {
    return error;
  } else if (Array.isArray(error)) {
    return error.flatMap(item => convert(item)).flat(Infinity);
  }
  return flatError(Object.entries(error));
};
