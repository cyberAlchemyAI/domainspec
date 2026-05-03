import assert from "node:assert/strict";
import test from "node:test";

import { buildServer } from "./server.js";

test("health endpoint returns ok", async (t) => {
  const app = buildServer();

  t.after(async () => {
    await app.close();
  });

  const response = await app.inject({
    method: "GET",
    url: "/health",
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    service: "domainspec-backend",
    status: "ok",
  });
});
