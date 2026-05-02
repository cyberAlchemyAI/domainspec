import { buildServer } from "./server.js";

async function start(): Promise<void> {
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? "0.0.0.0";

  const server = buildServer();
  await server.listen({ port, host });
}

start().catch((error) => {
  console.error("Failed to start backend runtime", error);
  process.exit(1);
});
