import sys
import os
import json
import subprocess
import html as _html
from http.server import SimpleHTTPRequestHandler, HTTPServer
import urllib.parse

PORT = int(os.environ.get("NEWSPAPER_PORT", 8001))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
TELEMETRY_DB = os.path.join(DIRECTORY, "telemetry_db.json")
PAYLOAD_DIR = DIRECTORY  # daily_payload.json lives here
MANIFEST_FILE = os.path.join(DIRECTORY, "generations_manifest.json")
PUBLICATIONS_DIR = os.path.join(DIRECTORY, "publications")

# ── Canonical metric names (from data-exchange-protocol.md) ──────────────
VALID_METRICS = {
    "editorial_density", "structure", "tone", "form",
    "topology", "visual_entropy", "interaction_mechanics", "global_fitness", "aesthetics"
}


class GeneticPlatformHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    # ── POST routes ──────────────────────────────────────────────────────
    def do_POST(self):
        if self.path == '/api/vote':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            try:
                vote = json.loads(post_data.decode('utf-8'))
                self.validate_vote(vote)
                self.save_vote(vote)
                self.send_json(200, {"status": "success", "synced": True})
            except ValueError as e:
                self.send_json(400, {"error": f"Schema validation failed: {e}"})
            except Exception as e:
                self.send_json(400, {"error": str(e)})
        elif self.path == '/api/trigger/editor':
            self.handle_trigger_editor()
        else:
            self.send_response(404)
            self.end_headers()

    # ── GET routes ───────────────────────────────────────────────────────
    def do_GET(self):
        path = self.path.split('?')[0]
        params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)

        if path == '/api/telemetry':
            self.handle_telemetry(params)
        elif path == '/api/payload':
            self.handle_payload(params)
        elif path == '/api/manifest':
            self.handle_manifest()
        elif path == '/api/trigger/status':
            self.handle_trigger_status()
        elif path == '/api/publications':
            self.handle_publications()
        elif path == '/api/doc':
            self.handle_doc(params)
        elif path == '/ontology-visualization':
            self.handle_ontology_viz()
        elif self.path.startswith('/agents/'):
            self.handle_agents_file()
        else:
            super().do_GET()

    # ── /api/telemetry?generation_id=XXX ─────────────────────────────────
    def handle_telemetry(self, params):
        db = self.load_db()
        generation_id = params.get('generation_id', [None])[0]
        if generation_id:
            db = [v for v in db if v.get('generation_id') == generation_id]
        self.send_json(200, db)

    # ── /api/payload?day=YYYY-MM-DD ──────────────────────────────────────
    def handle_payload(self, params):
        day = params.get('day', [None])[0]
        if day:
            filename = f"daily_payload_{day}.json"
            # Try publications/ first, then root fallback
            payload_file = os.path.join(PUBLICATIONS_DIR, filename)
            if not os.path.exists(payload_file):
                payload_file = os.path.join(PAYLOAD_DIR, filename)
        else:
            payload_file = os.path.join(PAYLOAD_DIR, "daily_payload.json")

        if os.path.exists(payload_file):
            with open(payload_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            self.send_json(200, data)
        else:
            self.send_json(404, {"error": f"No payload found", "path": payload_file})

    # ── /api/manifest ────────────────────────────────────────────────────
    def handle_manifest(self):
        if os.path.exists(MANIFEST_FILE):
            with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            self.send_json(200, data)
        else:
            self.send_json(404, {"error": "generations_manifest.json not found"})

    # ── /ontology-visualization ──────────────────────────────────────────
    def handle_ontology_viz(self):
        explorer_path = os.path.abspath(os.path.join(
            DIRECTORY, '../../../specs/ontology/docs/ontology-visualization/explorer.html'
        ))
        if os.path.exists(explorer_path):
            with open(explorer_path, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Cache-Control', 'no-store, must-revalidate')
            self.end_headers()
            self.wfile.write(content)
        else:
            self.send_json(404, {"error": "explorer.html not found. Run explorer.py first."})

    # ── /agents/* passthrough (for evolution-wall.md etc.) ───────────────
    def handle_agents_file(self):
        parent_dir = os.path.dirname(DIRECTORY)
        file_path = os.path.abspath(os.path.join(parent_dir, self.path.lstrip('/')))
        if os.path.exists(file_path) and os.path.isfile(file_path):
            self.send_response(200)
            if self.path.endswith('.md'):
                self.send_header('Content-type', 'text/markdown')
            self.send_header('Cache-Control', 'no-store, must-revalidate')
            self.end_headers()
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_response(404)
            self.end_headers()

    # ── POST /api/trigger/editor ─────────────────────────────────────────
    def handle_trigger_editor(self):
        script = os.path.join(DIRECTORY, 'editor_agent_scaffold.py')
        if not os.path.exists(script):
            self.send_json(500, {"error": "editor_agent_scaffold.py not found"})
            return
        subprocess.Popen(
            [sys.executable, script],
            env=os.environ.copy()
        )
        self.send_json(200, {
            "status": "triggered",
            "message": "Editor synthesis started in background"
        })

    # ── GET /api/publications ─────────────────────────────────────────────
    def handle_publications(self):
        """Lists all available publication dates, newest first."""
        os.makedirs(PUBLICATIONS_DIR, exist_ok=True)
        files = [
            f for f in os.listdir(PUBLICATIONS_DIR)
            if f.startswith('daily_payload_') and f.endswith('.json')
        ]
        # Also check root dir for legacy payloads
        root_files = [
            f for f in os.listdir(PAYLOAD_DIR)
            if f.startswith('daily_payload_') and f.endswith('.json') and f != 'daily_payload.json'
        ]
        all_files = set(files) | set(root_files)
        editions = []
        for filename in sorted(all_files, reverse=True):
            date_str = filename[len('daily_payload_'):-len('.json')]
            editions.append({
                "date": date_str,
                "filename": filename,
            })
        self.send_json(200, editions)

    # ── GET /api/doc?path=<relative_path> ────────────────────────────────
    def handle_doc(self, params):
        PROJECT_ROOT = '/Users/victorboscaro/house_project'
        ALLOWED_PREFIXES = (
            os.path.join(PROJECT_ROOT, 'docs', 'vault') + os.sep,
            os.path.join(PROJECT_ROOT, 'specs') + os.sep,
        )

        rel_path = params.get('path', [None])[0]
        if not rel_path:
            self.send_response(400)
            self.send_header('Content-type', 'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(b'Missing required query param: path')
            return

        resolved = os.path.realpath(os.path.join(PROJECT_ROOT, rel_path))

        if not any(resolved.startswith(prefix) for prefix in ALLOWED_PREFIXES):
            self.send_response(403)
            self.send_header('Content-type', 'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(b'Forbidden: path is outside allowed directories')
            return

        if not os.path.isfile(resolved):
            self.send_response(404)
            self.send_header('Content-type', 'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(f'Not found: {rel_path}'.encode('utf-8'))
            return

        with open(resolved, 'r', encoding='utf-8') as f:
            md_content = f.read()

        # Derive title from first # heading or filename
        title = os.path.basename(resolved)
        for line in md_content.splitlines():
            stripped = line.strip()
            if stripped.startswith('# '):
                title = stripped[2:].strip()
                break

        # Convert markdown to HTML
        try:
            import markdown as md_lib
            html_body = md_lib.markdown(
                md_content,
                extensions=['fenced_code', 'tables', 'toc']
            )
        except ImportError:
            html_body = f'<pre>{_html.escape(md_content)}</pre>'

        page = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{_html.escape(title)}</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      background: #111;
      color: #d4c9b0;
      font-family: 'Georgia', serif;
      font-size: 17px;
      line-height: 1.75;
      padding: 48px 32px;
      max-width: 780px;
      margin: 0 auto;
    }}
    h1 {{ font-size: 2rem; color: #e8dcc8; border-bottom: 1px solid #333; padding-bottom: 16px; margin-bottom: 32px; }}
    h2 {{ font-size: 1.4rem; color: #c9bda6; margin: 32px 0 12px; }}
    h3 {{ font-size: 1.1rem; color: #b8ac96; margin: 24px 0 8px; }}
    p {{ margin-bottom: 16px; }}
    code {{ font-family: 'Courier New', monospace; background: #1e1e1e; color: #a8d8a8; padding: 2px 6px; border-radius: 3px; font-size: 0.88em; }}
    pre {{ background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 6px; padding: 20px; overflow-x: auto; margin-bottom: 20px; }}
    pre code {{ background: none; padding: 0; color: #a8d8a8; }}
    blockquote {{ border-left: 3px solid #555; padding-left: 20px; color: #a09080; margin: 20px 0; font-style: italic; }}
    table {{ width: 100%; border-collapse: collapse; margin-bottom: 20px; }}
    th {{ background: #1e1e1e; color: #c9bda6; padding: 8px 12px; text-align: left; border-bottom: 1px solid #333; }}
    td {{ padding: 8px 12px; border-bottom: 1px solid #222; }}
    a {{ color: #8ab4c2; text-decoration: none; }}
    a:hover {{ text-decoration: underline; }}
    hr {{ border: none; border-top: 1px solid #2a2a2a; margin: 32px 0; }}
    ul, ol {{ padding-left: 24px; margin-bottom: 16px; }}
    li {{ margin-bottom: 6px; }}
    .source-label {{
      display: inline-block;
      font-family: 'Courier New', monospace;
      font-size: 0.75em;
      color: #888;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      padding: 4px 10px;
      border-radius: 3px;
      margin-bottom: 32px;
    }}
  </style>
</head>
<body>
  <div class="source-label">VAULT DOCUMENT · {_html.escape(rel_path)}</div>
  {html_body}
</body>
</html>"""

        encoded = page.encode('utf-8')
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(encoded)))
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.end_headers()
        self.wfile.write(encoded)

    # ── GET /api/trigger/status ───────────────────────────────────────────
    def handle_trigger_status(self):
        # Most recent daily_payload_*.json (date-sorted by filename)
        payload_files = sorted(
            [f for f in os.listdir(DIRECTORY) if f.startswith('daily_payload_') and f.endswith('.json')],
            reverse=True
        )
        if payload_files:
            latest_payload = payload_files[0]
            # filename is daily_payload_YYYY-MM-DD.json
            payload_date = latest_payload[len('daily_payload_'):-len('.json')]
            editor_ready = True
        else:
            latest_payload = None
            payload_date = None
            editor_ready = False

        # mutation_request.json
        mutation_request_file = os.path.join(DIRECTORY, 'mutation_request.json')
        pending_mutation = os.path.exists(mutation_request_file)
        mutation_request_id = None
        if pending_mutation:
            try:
                with open(mutation_request_file, 'r', encoding='utf-8') as f:
                    mr_data = json.load(f)
                mutation_request_id = mr_data.get('request_id')
            except Exception:
                pass

        # generations_manifest.json — first entry's id
        latest_generation = None
        if os.path.exists(MANIFEST_FILE):
            try:
                with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
                    manifest = json.load(f)
                if isinstance(manifest, list) and manifest:
                    latest_generation = manifest[0].get('id')
            except Exception:
                pass

        self.send_json(200, {
            "editor": {
                "latest_payload": latest_payload,
                "payload_date": payload_date,
                "ready": editor_ready,
            },
            "ui_evolution": {
                "pending_mutation_request": pending_mutation,
                "mutation_request_id": mutation_request_id,
                "latest_generation": latest_generation,
            }
        })

    # ── Vote schema validation ───────────────────────────────────────────
    def validate_vote(self, vote):
        # Reject legacy format
        if 'sentiment' in vote or 'component' in vote:
            raise ValueError(
                "Legacy vote format detected (sentiment/component). "
                "Use 'score' (1-5) and 'metric_name' per data-exchange-protocol.md"
            )
        # Required fields
        for field in ('id', 'generation_id', 'metric_name', 'score', 'timestamp'):
            if field not in vote:
                raise ValueError(f"Missing required field: '{field}'")
        # Metric name check
        if vote['metric_name'] not in VALID_METRICS:
            raise ValueError(
                f"Invalid metric_name '{vote['metric_name']}'. "
                f"Must be one of: {', '.join(sorted(VALID_METRICS))}"
            )
        # Score range check
        if not isinstance(vote['score'], int) or vote['score'] < 1 or vote['score'] > 5:
            raise ValueError(f"Score must be integer 1-5, got: {vote['score']}")

    # ── Persistence ──────────────────────────────────────────────────────
    def load_db(self):
        if os.path.exists(TELEMETRY_DB):
            with open(TELEMETRY_DB, 'r', encoding='utf-8') as f:
                try:
                    return json.load(f)
                except json.JSONDecodeError:
                    return []
        return []

    def save_vote(self, vote):
        db = self.load_db()
        # Prevent exact duplicates
        for existing in db:
            if existing.get('id') == vote.get('id'):
                return
        db.insert(0, vote)
        with open(TELEMETRY_DB, 'w', encoding='utf-8') as f:
            json.dump(db, f, indent=2)

    # ── Helpers ──────────────────────────────────────────────────────────
    def send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))


if __name__ == "__main__":
    def start_server(port):
        server_address = ('', port)
        try:
            httpd = HTTPServer(server_address, GeneticPlatformHandler)
            print("=" * 50)
            print(f"🧬 ZEFRAHUB GENETIC PLATFORM SERVER")
            print(f"Port: {port}")
            print(f"Directory: {DIRECTORY}")
            print(f"Telemetry DB: {TELEMETRY_DB}")
            print(f"Manifest: {MANIFEST_FILE}")
            print(f"URL: http://localhost:{port}")
            print(f"Routes: /api/vote, /api/telemetry, /api/payload, /api/manifest")
            print("=" * 50)
            httpd.serve_forever()
        except OSError as e:
            if e.errno == 48:
                print(f"Port {port} is in use, trying {port+1}...")
                start_server(port + 1)
            else:
                raise e
    try:
        start_server(PORT)
    except KeyboardInterrupt:
        print("\nShutting down server.")
        sys.exit(0)
