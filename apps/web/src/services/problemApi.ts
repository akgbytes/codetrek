import type { CreateProblemData } from "@repo/zod";
import { PROBLEM_PATH } from "../constants";
import { api } from "./api";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProblem: builder.mutation<
      ApiResponse<{ id: string; title: string }>,
      CreateProblemData
    >({
      query: (data) => ({
        url: `${PROBLEM_PATH}/create`,
        method: "POST",
        body: data,
      }),
    }),

    updateProblem: builder.mutation<ApiResponse<>, Problem>({
      query: (data) => ({
        url: `${PROBLEM_PATH}/create`,
        method: "POST",
        body: data,
      }),
    }),
    createProblem: builder.mutation<
      ApiResponse<{ id: string; title: string }>,
      Problem
    >({
      query: (data) => ({
        url: `${PROBLEM_PATH}/create`,
        method: "POST",
        body: data,
      }),
    }),
    createProblem: builder.mutation<
      ApiResponse<{ id: string; title: string }>,
      Problem
    >({
      query: (data) => ({
        url: `${PROBLEM_PATH}/create`,
        method: "POST",
        body: data,
      }),
    }),
    createProblem: builder.mutation<
      ApiResponse<{ id: string; title: string }>,
      Problem
    >({
      query: (data) => ({
        url: `${PROBLEM_PATH}/create`,
        method: "POST",
        body: data,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {} = authApi;
