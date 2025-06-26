export const LANGUAGE_MAP: Record<string, number> = {
  "C++": 54,
  PYTHON: 71,
  JAVASCRIPT: 63,
  JAVA: 62,
};

export const LANGUAGE_ID_MAP = Object.fromEntries(
  Object.entries(LANGUAGE_MAP).map(([language, id]) => [id, language])
);
