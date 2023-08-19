import { AxiosResponse } from "axios";

export type HttpErrorType = AxiosResponse<GeneralApiError | ValidationApiError>;

export type ValidationApiError = {
  detail: {location: [string, number]; message: string; type: string}[];
};

export type GeneralApiError = {
  detail: string;
};
