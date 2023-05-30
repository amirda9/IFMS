export const numberFormat = (
  separator: string,
  separateNumber: number,
  value: string,
) => {
  if (separateNumber === 0 || separator === '') {
    return value;
  }
  const re = new RegExp(`[0-9]{${separateNumber}}`, 'g');
  const newValue = value.replace(re, (item, place) =>
    place + separateNumber >= value.length ? item : item + separator,
  );
  return newValue;
};
