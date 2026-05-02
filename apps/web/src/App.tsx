import { useEffect, useState } from "react";

type HealthResponse = {
  service: string;
  status: "ok" | "degraded";
  database: { ok: boolean; reason?: string };
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHealth() {
      try {
        const response = await fetch(`${API_BASE}/health`);
        if (!response.ok) {
          throw new Error(
            `Backend health check failed with status ${response.status}`,
          );
        }

        const payload = (await response.json()) as HealthResponse;
        setHealth(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }

    loadHealth();
  }, []);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">DomainSpec Runtime</p>
        <h1>Knowledge Graph Visualization V1</h1>
        <p>
          Runtime scaffolding for Atlas Board, one-hop Neighborhood preview, and
          Concept Inspector flows.
        </p>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Atlas Board</h2>
          <p>
            Feature cards and capability anchors backed by
            /knowledge-graph/features.
          </p>
        </article>
        <article className="card">
          <h2>Neighborhood</h2>
          <p>
            Depth is locked to one-hop for V1 capability navigation behavior.
          </p>
        </article>
        <article className="card">
          <h2>Inspector</h2>
          <p>
            Concept evidence context from /knowledge-graph/concepts/:conceptId.
          </p>
        </article>
      </section>

      <section className="status">
        <h2>Backend Runtime Health</h2>
        {error ? <p className="error">{error}</p> : null}
        {health ? (
          <ul>
            <li>Service: {health.service}</li>
            <li>Status: {health.status}</li>
            <li>Database: {health.database.ok ? "connected" : "degraded"}</li>
            {health.database.reason ? (
              <li>Database detail: {health.database.reason}</li>
            ) : null}
          </ul>
        ) : (
          <p>Waiting for backend health response...</p>
        )}
      </section>
    </main>
  );
}
