import { existsSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const moduleRoot = resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "../..",
);

export function resolveDomainSpecRoot(): string {
  const explicit = process.env.DOMAINSPEC_ROOT;
  const candidates = [
    explicit,
    process.cwd(),
    resolve(process.cwd(), "implementation/domainspec"),
    resolve(process.cwd(), "domainspec"),
    moduleRoot,
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    if (isDomainSpecRoot(candidate)) return candidate;
  }

  return process.cwd();
}

export function resolveDomainSpecPath(pathValue: string): string {
  if (isAbsolute(pathValue)) return pathValue;

  const cwdCandidate = resolve(process.cwd(), pathValue);
  if (
    existsSync(cwdCandidate) ||
    pathValue.startsWith("./") ||
    pathValue.startsWith("../") ||
    pathValue.startsWith("implementation/")
  ) {
    return cwdCandidate;
  }

  const root = resolveDomainSpecRoot();
  const normalized = pathValue.startsWith("domainspec/")
    ? pathValue.slice("domainspec/".length)
    : pathValue;
  return resolve(root, normalized);
}

export function domainSpecRelative(pathValue: string): string {
  return relative(resolveDomainSpecRoot(), pathValue).replace(/\\/g, "/");
}

export function workspaceRelative(pathValue: string): string {
  return relative(process.cwd(), pathValue).replace(/\\/g, "/");
}

function isDomainSpecRoot(candidate: string): boolean {
  return (
    existsSync(resolve(candidate, "tools")) &&
    (existsSync(resolve(candidate, "CONSTITUTION.md")) ||
      existsSync(resolve(candidate, "AXIOMS.md")) ||
      existsSync(resolve(candidate, "TAXONOMY.md")))
  );
}
