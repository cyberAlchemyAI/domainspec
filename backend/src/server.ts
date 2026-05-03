import cors from "@fastify/cors";
import Fastify from "fastify";

export function buildServer() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });

  app.get("/health", async () => ({
    service: "domainspec-backend",
    status: "ok",
  }));

  return app;
}
