export const UserRole = {
  admin: "ADMIN",
  user: "USER",
} as const;

export const Provider = {
  local: "LOCAL",
  github: "GITHUB",
  google: "GOOGLE",
} as const;

export const Difficulty = {
  easy: "EASY",
  medium: "MEDIUM",
  hard: "HARD",
} as const;

export const ProblemType = {
  free: "FREE",
  premium: "PREMIUM",
  demo: "DEMO",
} as const;
