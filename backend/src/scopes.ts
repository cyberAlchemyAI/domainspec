export const SCOPES = {
  READ: "domainspec.kg.read",
  GOVERNANCE_READ: "domainspec.kg.governance.read",
} as const;

export type ScopeName = (typeof SCOPES)[keyof typeof SCOPES];
