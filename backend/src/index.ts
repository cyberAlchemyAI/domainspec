import { buildServer } from "./server.js";

function optionalEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

async function start(): Promise<void> {
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? "0.0.0.0";

  const server = buildServer({
    knowledgeGraph: {
      projectRootDir: optionalEnv("KG_PROJECT_ROOT_DIR"),
      featureDocsRootDir: optionalEnv("KG_FEATURE_DOCS_ROOT_DIR"),
      relationshipsFilePath: optionalEnv("KG_RELATIONSHIPS_FILE_PATH"),
      databaseFilePath: optionalEnv("KG_DATABASE_FILE_PATH"),
    },
  });
  await server.listen({ port, host });
}

start().catch((error) => {
  console.error("Failed to start backend runtime", error);
  process.exit(1);
});
