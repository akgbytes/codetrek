import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { BASE_URL, AUTH_PATH } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error?.status === 401 &&
    (result.error.data as { message?: string })?.message === "TokenExpiredError"
  ) {
    await baseQuery(`${AUTH_PATH}/refresh`, api, extraOptions);
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};
