import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import "server-only";
import { SessionData, sessionOptions } from "../session";
import { FetcherProps, Response } from "./types";
interface ServerFetcherProps extends FetcherProps {
  /** Whether to include authorization token in the request */
  token?: boolean;
  /** Whether the request is to a local API endpoint */
  isLocalApi?: boolean;
  /** Whether the payload is FormData */
  isFormData?: boolean;
  /** Cache strategy for the request */
  cache?: "default" | "force-cache" | "no-store";
}

export default async function fetcher<IReturn>({
  request,
  method = "GET",
  payload = null,
  token = false,
  headerOptions = {},
  options = {},
  isLocalApi = false,
  isFormData = false,
}: ServerFetcherProps): Promise<Response<IReturn>> {
  let authorization = {};
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (token) {
    authorization = session.user?.token && {
      authorization: `Bearer ${session?.user?.token}`,
    };
  }
  const baseUrl = isLocalApi
    ? process.env.NEXT_PUBLIC_FRONTEND_ENDPOINT
    : process.env.NEXT_PUBLIC_API_ENDPOINT;
  if (!baseUrl) {
    throw new Error("API endpoint is not configured");
  }
  const url = `${baseUrl}/${request}`;

  const response = await fetch(url, {
    method,
    headers: {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...headerOptions,
      ...authorization,
    },
    ...options,
    body: payload
      ? isFormData
        ? (payload as unknown as FormData)
        : typeof payload === "string"
        ? payload
        : JSON.stringify(payload)
      : null,
  });
  const result: Response<IReturn> = await response.json();
  if (!response.ok) {
    throw { ...result, ok: response.ok };
  }

  return { ...result, ok: response.ok };
}
