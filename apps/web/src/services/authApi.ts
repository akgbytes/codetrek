import { AUTH_PATH } from "../constants";
import { api } from "./api";
import type {
  EmailData,
  LoginData,
  RegisterData,
  ResetPasswordData,
} from "@repo/zod";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<User>, RegisterData>({
      query: (data) => ({
        url: `${AUTH_PATH}/register`,
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation<ApiResponse<null>, LoginData>({
      query: (data) => ({
        url: `${AUTH_PATH}/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: `${AUTH_PATH}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    googleLogin: builder.mutation<
      ApiResponse<null>,
      { token: string; rememberMe?: boolean }
    >({
      query: (data) => ({
        url: `${AUTH_PATH}/login/google`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    verifyEmail: builder.query<ApiResponse<null>, string>({
      query: (token) => ({
        url: `${AUTH_PATH}/verify/${token}`,
        method: "GET",
      }),
    }),

    resendVerification: builder.mutation<ApiResponse<null>, EmailData>({
      query: (data) => ({
        url: `${AUTH_PATH}/email/resend`,
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<
      ApiResponse<null> | ApiResponse<{ code: string }>,
      EmailData
    >({
      query: (data) => ({
        url: `${AUTH_PATH}/password/forgot`,
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<
      ApiResponse<null>,
      ResetPasswordData & { token: String }
    >({
      query: ({ token, password, confirmPassword }) => ({
        url: `${AUTH_PATH}/password/reset/${token}`,
        method: "POST",
        body: { password, confirmPassword },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;
