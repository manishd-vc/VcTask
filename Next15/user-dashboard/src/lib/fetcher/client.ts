"use client";

import type { FetcherProps, Response } from "./types";

interface ClientFetcherProps extends FetcherProps {
  token?: string;
  isLocalApi?: boolean;
}

/**
 * Generic fetch wrapper for making HTTP requests to the API
 * @template Return - The expected return type of the API response
 * @param {Object} props - The fetcher configuration object
 * @param {string} props.request - The API endpoint path
 * @param {string} [props.method="GET"] - The HTTP method to use
 * @param {Object|null} [props.payload=null] - The request payload/body
 * @param {string} [props.token=""] - JWT authentication token
 * @param {Object} [props.headerOptions={}] - Additional headers to include
 * @param {Object} [props.options={}] - Additional fetch options
 * @returns {Promise<Response<Return>>} A promise that resolves to the API response
 * @throws {Response} Throws the response object if the request is not successful
 */
export default async function fetcher<Return>({
  request,
  method = "GET",
  payload = null,
  token = "",
  isLocalApi = false,
  headerOptions = {},
  options = {},
}: ClientFetcherProps): Promise<Response<Return>> {
  // Construct headers
  const headers = {
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    ...(token && { authorization: `Bearer ${token}` }),
    ...headerOptions,
  };

  // Construct URL
  const baseUrl = isLocalApi
    ? process.env.NEXT_PUBLIC_FRONTEND_ENDPOINT
    : process.env.NEXT_PUBLIC_API_ENDPOINT;
  const url = `${baseUrl}/${request}`;
  // Prepare request configuration
  const requestConfig = {
    method,
    headers,
    ...options,
    body: payload ? JSON.stringify(payload) : null,
  };
  const response = await fetch(url, requestConfig);
  const result: Response<Return> = await response.json();

  // error handling
  if (!response.ok) {
    throw result;
  }

  return result;
}
