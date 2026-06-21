import { describe, expect, it } from "vitest";
import { containmentError } from "./containment.js";

describe("containmentError", () => {
  const root = "/repo/validation/poker-team/docs/features/financial-settlement";

  it("allows a path inside the allowed root", () => {
    expect(containmentError(`${root}/TEST-SPEC.engine.md`, root)).toBeNull();
  });

  it("rejects a path escaping the allowed root", () => {
    expect(containmentError(`${root}/../../../../etc/passwd`, root)).toMatch(
      /outside the allowed root/,
    );
  });

  it("rejects writing into the public arcanum submodule", () => {
    expect(containmentError("/repo/arcanum/spells/x.md", "/repo")).toMatch(
      /arcanum/,
    );
  });

  it("allows a normal repo path under a broad root", () => {
    expect(
      containmentError(
        "/repo/validation/poker-team/backend/src/domain/__derived__/x.test.ts",
        "/repo",
      ),
    ).toBeNull();
  });
});
