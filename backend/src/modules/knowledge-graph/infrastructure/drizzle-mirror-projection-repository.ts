import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import Database from "better-sqlite3";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { MirrorProjectionRepositoryPort } from "../application/ports.js";
import { createKnowledgeGraphError } from "../domain/errors.js";
import type { MirrorProjection } from "../domain/models.js";

const projectionSnapshotsTable = sqliteTable("kg_projection_snapshots", {
  snapshotId: text("snapshot_id").primaryKey(),
  featureId: text("feature_id").notNull(),
  generatedAt: text("generated_at").notNull(),
  nodeCount: integer("node_count").notNull(),
  edgeCount: integer("edge_count").notNull(),
  payload: text("payload").notNull(),
});

interface DrizzleMirrorProjectionRepositoryConfig {
  readonly databaseFilePath: string;
}

export function createDrizzleMirrorProjectionRepository(
  config: DrizzleMirrorProjectionRepositoryConfig,
): MirrorProjectionRepositoryPort {
  mkdirSync(dirname(config.databaseFilePath), { recursive: true });

  const sqlite = new Database(config.databaseFilePath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.exec(`
      CREATE TABLE IF NOT EXISTS kg_projection_snapshots (
        snapshot_id TEXT PRIMARY KEY,
        feature_id TEXT NOT NULL,
        generated_at TEXT NOT NULL,
        node_count INTEGER NOT NULL,
        edge_count INTEGER NOT NULL,
        payload TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS kg_projection_snapshots_feature_idx
        ON kg_projection_snapshots(feature_id, generated_at DESC);
    `);

  const database: BetterSQLite3Database = drizzle(sqlite);

  return {
    saveProjection(projection: MirrorProjection): void {
      const payload = JSON.stringify(projection);

      try {
        database.transaction((transaction) => {
          transaction
            .insert(projectionSnapshotsTable)
            .values({
              snapshotId: projection.snapshotId,
              featureId: projection.featureId,
              generatedAt: projection.generatedAt,
              nodeCount: projection.nodeCount,
              edgeCount: projection.edgeCount,
              payload,
            })
            .run();
        });
      } catch (error) {
        throw createKnowledgeGraphError(
          "MIRROR_PROJECTION_PERSISTENCE_FAILED",
          "Failed to persist projection snapshot",
          {
            featureId: projection.featureId,
            snapshotId: projection.snapshotId,
            reason: String(error),
          },
        );
      }
    },

    getLatestProjection(featureId: string): MirrorProjection | null {
      const row = database
        .select()
        .from(projectionSnapshotsTable)
        .where(eq(projectionSnapshotsTable.featureId, featureId))
        .orderBy(desc(projectionSnapshotsTable.generatedAt))
        .limit(1)
        .get();

      if (!row) {
        return null;
      }

      try {
        return JSON.parse(row.payload) as MirrorProjection;
      } catch (error) {
        throw createKnowledgeGraphError(
          "MIRROR_PROJECTION_PERSISTENCE_FAILED",
          "Persisted projection payload is not valid JSON",
          {
            featureId,
            snapshotId: row.snapshotId,
            reason: String(error),
          },
        );
      }
    },

    close(): void {
      sqlite.close();
    },
  };
}
