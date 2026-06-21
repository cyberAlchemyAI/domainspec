// Write-path containment guard (G3, SWU-4). A resolved output path MUST stay inside
// the allowed root and MUST NOT escape into the public `arcanum` submodule. Pure +
// unit-testable; used by both `derive --out` and `emit-tests`.

import { relative, resolve } from "node:path";

export function containmentError(
  outPath: string,
  allowedRoot: string,
): string | null {
  const resolved = resolve(outPath);
  const root = resolve(allowedRoot);
  const rel = relative(root, resolved);
  if (rel.startsWith("..") || resolve(root, rel) !== resolved) {
    return `refusing to write outside the allowed root:\n  path: ${resolved}\n  root: ${root}`;
  }
  if (resolved.includes("/arcanum/")) {
    return `refusing to write into the public arcanum submodule: ${resolved}`;
  }
  return null;
}
