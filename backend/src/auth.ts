import type { FastifyReply, FastifyRequest } from "fastify";

function normalizeScopeHeader(value: string): string[] {
  return value
    .split(/[\s,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function extractScopes(request: FastifyRequest): Set<string> {
  const rawHeader = request.headers["x-scopes"];
  const joined = Array.isArray(rawHeader)
    ? rawHeader.join(" ")
    : (rawHeader ?? "");
  return new Set(normalizeScopeHeader(String(joined)));
}

export function requireScopes(requiredScopes: string[]) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const availableScopes = extractScopes(request);
    const missingScopes = requiredScopes.filter(
      (scope) => !availableScopes.has(scope),
    );

    if (missingScopes.length === 0) {
      return;
    }

    reply.code(403).send({
      error: "forbidden",
      message: "Request is missing required scopes",
      requiredScopes,
      missingScopes,
    });
  };
}
