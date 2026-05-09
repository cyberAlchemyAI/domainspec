import cors from "@fastify/cors";
import Fastify from "fastify";

import {
  registerKnowledgeGraphRoutes,
  type RegisterKnowledgeGraphRoutesOptions,
} from "./modules/knowledge-graph/index.js";
import {
  registerUiPrototypingStudioRoutes,
  type RegisterUiPrototypingStudioRoutesOptions,
} from "./modules/ui-prototyping-studio/index.js";

interface BuildServerOptions {
  knowledgeGraph?: RegisterKnowledgeGraphRoutesOptions;
  uiPrototypingStudio?: RegisterUiPrototypingStudioRoutesOptions;
}

export function buildServer(options: BuildServerOptions = {}) {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });

  app.get("/health", async () => ({
    service: "domainspec-backend",
    status: "ok",
  }));

  registerKnowledgeGraphRoutes(app, options.knowledgeGraph);
  registerUiPrototypingStudioRoutes(app, options.uiPrototypingStudio);

  return app;
}
