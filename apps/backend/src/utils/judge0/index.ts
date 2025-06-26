import { CustomError } from "@repo/utils";

const LANGUAGE_MAP: Record<string, number> = {
  "C++": 54,
  PYTHON: 71,
  JAVASCRIPT: 63,
  JAVA: 62,
};

const LANGUAGE_ID_MAP = Object.fromEntries(
  Object.entries(LANGUAGE_MAP).map(([language, id]) => [id, language])
);

export const getLanguageId = (language: string) => {
  const normalized = language.toUpperCase();
  const id = LANGUAGE_MAP[normalized];
  if (!id)
    throw new CustomError(400, `Language "${language}" is not supported.`);

  return id;
};

export const getLanguageName = (id: string) => {
  const name = LANGUAGE_ID_MAP[id];
  if (!name) throw new CustomError(400, `Language ID ${id} is not supported.`);

  return name;
};
