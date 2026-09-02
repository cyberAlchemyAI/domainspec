import { createHash } from "node:crypto";

import type { ContentDigestPort } from "../application/compile-event-sourcing-contract.js";

export function makeSha256ContentDigest(): ContentDigestPort {
  return {
    sha256(content) {
      return createHash("sha256").update(content, "utf8").digest("hex");
    },
  };
}
