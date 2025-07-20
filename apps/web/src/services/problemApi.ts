import type { CreateProblemData, UpdateProblemData } from "@repo/zod";
import type { Problem } from "@repo/drizzle";
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

    updateProblem: builder.mutation<
      ApiResponse<Problem>,
      UpdateProblemData & { id: string }
    >({
      query: ({ id, ...rest }) => ({
        url: `${PROBLEM_PATH}/update/${id}`,
        method: "PATCH",
        body: rest,
      }),
    }),

    deleteProblem: builder.mutation<ApiResponse<Problem>, { id: string }>({
      query: ({ id }) => ({
        url: `${PROBLEM_PATH}/delete/${id}`,
        method: "DELETE",
      }),
    }),

    getAllProblems: builder.query<ApiResponse<Problem[]>, void>({
      query: () => ({
        url: `${PROBLEM_PATH}`,
        method: "GET",
      }),
    }),

    getProblemById: builder.query<ApiResponse<Problem>, { id: string }>({
      query: ({ id }) => ({
        url: `${PROBLEM_PATH}/${id}`,
        method: "GET",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateProblemMutation,
  useUpdateProblemMutation,
  useDeleteProblemMutation,
  useLazyGetAllProblemsQuery,
  useLazyGetProblemByIdQuery,
} = authApi;
