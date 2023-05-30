export const convertObjectToUrlParams = (
  url: string,
  ob?: Record<string, string | number>,
) => {
  if (!ob) {
    return url;
  }
  let newUrl = url;
  Object.entries(ob).forEach(([key, value]) => {
    newUrl = newUrl.replace(`{${key}}`, value.toString());
  });
  return newUrl;
};
