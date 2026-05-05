export function bankrollVisibilityRule(viewerRole: string): boolean {
  return viewerRole === "admin" || viewerRole === "coach";
}

export function getCoachPortfolio(viewerRole: string): { ok: true } {
  if (!bankrollVisibilityRule(viewerRole)) {
    throw new Error("FORBIDDEN");
  }

  return { ok: true };
}
