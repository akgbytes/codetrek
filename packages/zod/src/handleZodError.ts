// import { SafeParseReturnType } from "zod";
// import { CustomError } from "./CustomError";
// import { ResponseStatus } from "./constants";

// export const handleZodError = <T>(
//   result: SafeParseReturnType<unknown, T>
// ): T => {
//   if (!result.success) {
//     const firstIssue = result.error.issues[0];
//     const path = firstIssue.path.join(".");

//     if (
//       firstIssue.code === "invalid_type" &&
//       firstIssue.received === "undefined"
//     ) {
//       throw new CustomError(
//         ResponseStatus.BadRequest,
//         path ? `Missing '${path}' field` : "Missing required fields"
//       );
//     }

//     const message = path ? firstIssue.message : firstIssue.message;

//     throw new CustomError(ResponseStatus.UnprocessableEntity, message);
//   }

//   return result.data;
// };
