import { ApiError } from "@repo/utils";
import { LANGUAGE_MAP, LANGUAGE_ID_MAP } from "./constants";

export const getLanguageId = (language: string) => {
  const normalized = language.toUpperCase();
  const id = LANGUAGE_MAP[normalized];
  if (!id) throw new ApiError(400, `Language "${language}" is not supported.`);
  return id;
};

export const getLanguageName = (id: string) => {
  const name = LANGUAGE_ID_MAP[id];
  if (!name) throw new ApiError(400, `Language ID ${id} is not supported.`);
  return name;
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
