export interface Response<T> {
  data: T;
  message: string;
  status: boolean;
  statusCode: number;
  ok: boolean;
}

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type Payload = Record<string, unknown> | null | FormData | string;

export interface FetcherProps {
  request: string;
  method?: RequestMethod;
  payload?: Payload;
  headerOptions?: { [key: string]: string };
  isFormData?: boolean;
  type?: "default" | "report";
  options?: Record<string, unknown>;
}
