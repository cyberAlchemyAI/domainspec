import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { appendFile, mkdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 8766);
const HTML_PATH = join(__dirname, 'fractal-ghibli.html');
const DATA_DIR = join(__dirname, 'data');
const TELEMETRY_PATH = join(DATA_DIR, 'fractal-telemetry.jsonl');

function send(res, status, body, headers = {}) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
  res.writeHead(status, {
    'Content-Type': typeof body === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    ...headers
  });
  res.end(payload);
}

function serveFile(res, path, contentType) {
  res.writeHead(200, { 'Content-Type': contentType });
  createReadStream(path).pipe(res);
}

async function readBody(req, limit = 1_000_000) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error('Payload too large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function normalizeEvents(payload) {
  const parsed = JSON.parse(payload || '{}');
  const events = Array.isArray(parsed.events) ? parsed.events : [parsed];
  return events
    .filter(Boolean)
    .map((event) => ({
      receivedAt: new Date().toISOString(),
      sessionId: event.sessionId || parsed.sessionId || null,
      page: parsed.page || null,
      type: event.type || 'unknown',
      t: event.t ?? null,
      at: event.at || null,
      data: event.data || {},
      userAgent: parsed.userAgent || null
    }));
}

async function appendTelemetry(events) {
  await mkdir(DATA_DIR, { recursive: true });
  const lines = events.map((event) => JSON.stringify(event)).join('\n') + '\n';
  await appendFile(TELEMETRY_PATH, lines, 'utf8');
}

async function telemetryStats() {
  try {
    const content = await readFile(TELEMETRY_PATH, 'utf8');
    const lines = content.trim() ? content.trim().split('\n') : [];
    const sessions = new Set();
    let lastEventAt = null;
    let lastType = null;

    for (const line of lines) {
      try {
        const event = JSON.parse(line);
        if (event.sessionId) sessions.add(event.sessionId);
        lastEventAt = event.receivedAt || lastEventAt;
        lastType = event.type || lastType;
      } catch {
        // Ignore corrupt tail lines while still reporting usable stats.
      }
    }

    return {
      eventCount: lines.length,
      sessionCount: sessions.size,
      lastEventAt,
      lastType,
      path: TELEMETRY_PATH
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {
        eventCount: 0,
        sessionCount: 0,
        lastEventAt: null,
        lastType: null,
        path: TELEMETRY_PATH
      };
    }
    throw error;
  }
}

async function telemetryTail(limit = 100) {
  try {
    const content = await readFile(TELEMETRY_PATH, 'utf8');
    const lines = content.trim() ? content.trim().split('\n') : [];
    return lines.slice(-limit).map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { corrupt: line };
      }
    });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || `${HOST}:${PORT}`}`);
    const pathname = decodeURIComponent(url.pathname);

    if (req.method === 'GET' && (pathname === '/' || pathname === '/fractal-ghibli' || pathname === '/fractal-ghibli.html')) {
      await stat(HTML_PATH);
      serveFile(res, HTML_PATH, 'text/html; charset=utf-8');
      return;
    }

    if (req.method === 'POST' && pathname === '/telemetry/events') {
      const body = await readBody(req);
      const events = normalizeEvents(body);
      if (events.length) await appendTelemetry(events);
      send(res, 202, { ok: true, accepted: events.length });
      return;
    }

    if (req.method === 'GET' && pathname === '/api/stats') {
      send(res, 200, await telemetryStats());
      return;
    }

    if (req.method === 'GET' && pathname === '/telemetry/events') {
      const limit = Math.max(1, Math.min(1000, Number(url.searchParams.get('limit') || 100)));
      send(res, 200, await telemetryTail(limit));
      return;
    }

    if (req.method === 'GET' && pathname === '/telemetry/download') {
      await mkdir(DATA_DIR, { recursive: true });
      try {
        await stat(TELEMETRY_PATH);
      } catch (error) {
        if (error.code === 'ENOENT') await appendFile(TELEMETRY_PATH, '', 'utf8');
        else throw error;
      }
      serveFile(res, TELEMETRY_PATH, 'application/x-ndjson; charset=utf-8');
      return;
    }

    send(res, 404, { error: 'Not found' });
  } catch (error) {
    send(res, error.message === 'Payload too large' ? 413 : 500, {
      error: error.message
    });
  }
});

server.listen(PORT, HOST, () => {
  const base = `http://${HOST}:${PORT}`;
  console.log(`Fractal visualization server running at ${base}/`);
  console.log(`Open with perf overlay: ${base}/?perf=1`);
  console.log(`Telemetry stats: ${base}/api/stats`);
  console.log(`Telemetry file: ${resolve(TELEMETRY_PATH)}`);
});
