import dayjs from "dayjs"

export const getPrettyDateTime = (isoDateTime: string | undefined = undefined) => {
  return dayjs(isoDateTime).format("YYYY-MM-DD HH:mm:ss");
}