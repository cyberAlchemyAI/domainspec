"""
Editor-in-Chief Agent Synthesis Pipeline

This script implements the Editor-in-Chief's core directive:
Scrape recent vault activity and use an LLM (Gemini) to synthesize 
a structured, multi-tiered JSON payload matching the `News Object Schema`
from `data-exchange-protocol.md`.

Requires: GEMINI_API_KEY environment variable.
"""
import os
import sys
import argparse
import json
import datetime
import glob
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List, Literal

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
VAULT_DIR = os.path.abspath(os.path.join(OUTPUT_DIR, "../../../docs/vault/conversations"))

# ── Tuning knobs ──────────────────────────────────────────────────────────────
# Increase to give the model more context per file (better quality, more tokens).
# Decrease to reduce token usage (faster, cheaper, but lossy on long sessions).
MAX_CHARS_PER_FILE = 1750

# ── Pydantic Schema for Structured Output ────────────────────────────────────

class ArticleMeta(BaseModel):
    impact: float = Field(description="Impact score from 0.0 to 10.0, based on architectural or strategic weight", ge=0.0, le=10.0)
    risk: Literal["low", "medium", "high"]
    source_files: List[str]

class Article(BaseModel):
    id: str = Field(description="unique identifier (e.g., node_uuid)")
    type: str = Field(description="Article type: e.g. decision, progress, discovery, risk, architectural_decision, constitutional_rule, feature_evolution, meta_reflection, domain_context, risk_alert")
    tag: str = Field(description="Short thematic tag, e.g. 'CCB | Migration'")
    title: str
    body: str = Field(description="Single dense HTML article body. Business-focused, opinionated. Use <p>, <strong>, <code> tags.")
    meta: ArticleMeta

class EditorialVectors(BaseModel):
    form: Literal["narrative", "analytical", "telegraphic"]
    tone: Literal["dark_sepia", "clinical", "lyrical"]
    structure: Literal["hierarchical", "flat", "fractal"]

class MetadataStats(BaseModel):
    sessions: int
    decisions: int
    spec_changes: int

class PayloadMetadata(BaseModel):
    date: str
    generated_at: str
    editorial_vectors: EditorialVectors
    stats: MetadataStats

class NewsPayload(BaseModel):
    metadata: PayloadMetadata
    articles: List[Article]

# ─────────────────────────────────────────────────────────────────────────────

def get_recent_vault_files(num_files=100, target_date=None):
    """Finds markdown files in the vault.

    If target_date (YYYY-MM-DD) is provided, returns only files whose basename
    starts with that date prefix. Otherwise returns the N most recently
    modified files.
    """
    search_pattern = os.path.join(VAULT_DIR, "**/*.md")
    files = glob.glob(search_pattern, recursive=True)
    if not files:
        print(f"No markdown files found in {VAULT_DIR}")
        return []

    if target_date:
        matched = [f for f in files if os.path.basename(f).startswith(target_date)]
        matched.sort(key=os.path.getmtime, reverse=True)
        return matched

    files.sort(key=os.path.getmtime, reverse=True)
    return files[:num_files]

STRUCTURED_SUBDIRS = (
    "constitution", "axiom", "premise", "conceptual",
    "discovery", "domain", "backlog",
)
VAULT_ROOT = os.path.abspath(os.path.join(OUTPUT_DIR, "../../../docs/vault"))
PROJECT_ROOT = os.path.abspath(os.path.join(OUTPUT_DIR, "../../.."))


def get_structured_docs_inventory():
    """Returns [(relative_path, title)] for stable reference docs in the vault.

    Sources: constitution/, axiom/, premise/, conceptual/, discovery/, domain/,
    backlog/, and top-level dictionary-*.md. Conversations are excluded.
    """
    paths = []
    for sub in STRUCTURED_SUBDIRS:
        paths.extend(glob.glob(os.path.join(VAULT_ROOT, sub, "**/*.md"), recursive=True))
    paths.extend(glob.glob(os.path.join(VAULT_ROOT, "dictionary-*.md")))

    inventory = []
    for p in paths:
        title = os.path.basename(p)
        try:
            with open(p, "r", encoding="utf-8") as f:
                for line in f:
                    s = line.strip()
                    if s.startswith("# "):
                        title = s[2:].strip()
                        break
        except Exception:
            pass
        rel = os.path.relpath(p, PROJECT_ROOT)
        inventory.append((rel, title))
    inventory.sort()
    return inventory


def read_file_content(filepath, max_chars=MAX_CHARS_PER_FILE):
    """Reads content, truncating to avoid blowing up context window."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            if len(content) > max_chars:
                return content[:max_chars] + f"\n\n...[TRUNCATED to {max_chars} chars]..."
            return content
    except Exception as e:
        return f"Error reading {filepath}: {e}"

def synthesize_payload(vault_contents: str, structured_inventory: list = None) -> str:
    """Calls Gemini to convert vault text into the News Object Schema."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is missing.")

    client = genai.Client()

    inventory_block = ""
    if structured_inventory:
        lines = [f"- {rel} — {title}" for rel, title in structured_inventory]
        inventory_block = (
            "\n\nSTRUCTURED REFERENCE DOCS (use these as source_files when relevant):\n"
            + "\n".join(lines)
        )

    prompt = f"""
You are the Editor-in-Chief of 'O Grafo Diário' — ZefraHub's internal daily intelligence brief.

Your reader is a technical founder or CTO opening this at 7am before their first meeting. They have 5 minutes. They need to know: what happened, what it means for the business, and whether it requires a decision today.

Raw Vault Content (Recent Sessions):
-----------------------------------
{vault_contents}
-----------------------------------

EDITORIAL RULES (non-negotiable):

1. BUSINESS IMPACT FIRST.
   Every article opens with what changed and what it costs or enables — in business terms, as well as why that is relevant to the business. Don't use technical terms, no functions name, nothing. Not "a bug was fixed." But "the extraction pipeline now runs clean. The semantic search layer can be wired. This means agents can index and retrieve the code itself, increasing context and reducing tokens usage."

2. ONE VOICE. NO TIERS.
   Write a single dense paragraph per article. No exec/tech/graph split. No labels. No headers inside the article. The reader gets everything in one read — technical enough to be precise, business-focused enough to be actionable.

3. OPINIONATED. NOT NEUTRAL.
   Name the risk if there is one. Name the opportunity if it's real. Do not hedge on things you observed. "This is a blocker until X" or "This closes the path to Y" — say it plainly.

4. SOURCE FILES MUST BE STRUCTURED REFERENCES.
   The `meta.source_files` list must cite the STRUCTURED REFERENCE DOCS below (constitutions, axioms, premises, discoveries, domain docs, dictionaries) — NOT the raw conversation files. For each article, pick the 1–3 structured docs that best describe the subject. Use the exact project-relative path shown in the inventory (e.g. `docs/vault/constitution/foo.md`). Only fall back to a conversation filename if NO structured doc in the inventory covers the subject. These render as clickable links in the newspaper.{inventory_block}

5. NO FILLER. NO SUMMARIES OF SUMMARIES.
   Cut any sentence that could appear in any status update for any company. Every sentence must be traceable to something specific that happened in the vault sessions.

HTML FORMATTING (required — injected via innerHTML):
   - Wrap the entire body in one or more <p> tags
   - Use <strong> for decisions, risks, and key outcomes
   - Use <code> for technical identifiers (file names, function names, schema fields)
   - No <h1>/<h2>/<h3> inside the body — the title is rendered separately

REFERENCE EXAMPLE — This is the quality bar. Study the structure before writing:

  TITLE: "Domain-Tagging Constitution Ratified, Embedding Business Vocabulary into Code and Agent Workflows"

  BODY:
  <p><strong>A new domain-tagging system using <code>@biz</code>/<code>@sys</code> docstring tags was ratified, creating a machine-readable bridge between business concepts in the ontology and their implementation in the codebase.</strong> This governance was then embedded into core agent workflows, making domain-awareness an enforceable, automated behavior — and closing the gap between what the business knows and what the code expresses.</p>
  <p><strong>Mechanism:</strong> Python docstring tags (e.g., <code>@biz(term="Remessa", type="Event")</code>) coupled directly to code symbols. <strong>Foundation:</strong> A restructured <code>dictionary-business.md</code> organized by domain (Core, Aquisição, Documents) with explicit taxonomy_type and edge definitions. <strong>Enforcement:</strong> <code>CLAUDE.md</code> now routes tasks to specific skills for dictionary maintenance (Route 3) and code tagging (Route 4) — compliance is structural, not voluntary.</p>
  <p><strong>// KNOWLEDGE GRAPH DELTA</strong><br>
  NEW_EDGE(CodeSymbol)-[ANNOTATED_BY]->(OntologyTerm)<br>
  NEW_NODE(AgentWorkflow::{{concern: 'DictionaryMaintenance'}})<br>
  NEW_NODE(AgentWorkflow::{{concern: 'CodeTagging'}})<br>
  NODE(Codebase) | state: Opaque → Queryable<br>
  AXIOM_ESTABLISHED('Code is an extension of the knowledge graph')</p>

  What makes this article work:
  - Opens with what changed and what it enables — in one sentence, no warmup
  - Mechanism / Foundation / Enforcement: three tight labeled points, each one sentence
  - Graph delta: states new edges and nodes as facts, not explanations
  - Zero filler. Every sentence names a specific file, rule, or structural change.

PRIORITIZATION:
   Architectural decisions > feature progress > operational fixes > housekeeping.
   If something closes a blocker or opens a new capability: that's the lead.

MINIMUM: 5 articles. Up to 12 if the sessions justify it.

IMPACT SCORE: float 0.0–10.0.
   9-10 = the system's strategic direction changed.
   7-8.9 = a major structural constraint resolved or created.
   5-6.9 = meaningful progress with business residue.
   Below 5 = operational, no strategic consequence.

You MUST return a JSON object exactly matching the schema.
"""
    
    # We use response_schema to enforce the exact JSON format defined in the protocol.
    # We ask for application/json response_mime_type.
    try:
        response = client.models.generate_content(
            model='gemini-2.5-pro',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=NewsPayload,
                temperature=0.3
            ),
        )
        return response.text
    except Exception as e:
        raise RuntimeError(f"LLM Synthesis failed: {e}")

def generate_daily_payload(target_date=None):
    print(f"Editor-in-Chief Agent: Starting synthesis (target_date={target_date or 'today'})...")

    # 1. Scrape Vault
    if target_date:
        recent_files = get_recent_vault_files(target_date=target_date)
        if not recent_files:
            print(f"No vault files found with prefix {target_date}")
            return
    else:
        recent_files = get_recent_vault_files(30)
        if not recent_files:
            return
        
    print(f"Scraped {len(recent_files)} recent files. Reading contents...")
    vault_text = ""
    for f in recent_files:
        vault_text += f"\n=== FILE: {os.path.basename(f)} ===\n"
        vault_text += read_file_content(f)
        vault_text += "\n=========================\n"

    # 2. LLM Synthesis
    print("Sending to Gemini for structured synthesis... (this takes a few seconds)")
    try:
        structured_inventory = get_structured_docs_inventory()
        print(f"Loaded {len(structured_inventory)} structured reference docs for citation.")
        json_str = synthesize_payload(vault_text, structured_inventory)
    except Exception as e:
        print(f"ERROR: {e}")
        return

    # 3. Parse and cleanup
    try:
        payload = json.loads(json_str)
        # Ensure metadata has the target (or current) date
        effective_date = target_date or datetime.date.today().isoformat()
        if "metadata" in payload:
            payload["metadata"]["date"] = effective_date
            payload["metadata"]["generated_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()

        # Resolve source_files (bare basenames from prompt) to project-relative
        # paths so /api/doc?path=... can serve them as clickable links.
        PROJECT_ROOT = os.path.abspath(os.path.join(OUTPUT_DIR, "../../.."))
        basename_to_rel = {
            os.path.basename(p): os.path.relpath(p, PROJECT_ROOT)
            for p in recent_files
        }
        for article in payload.get("articles", []):
            meta = article.get("meta", {})
            resolved = []
            for sf in meta.get("source_files", []):
                resolved.append(basename_to_rel.get(os.path.basename(sf), sf))
            meta["source_files"] = resolved
    except json.JSONDecodeError as e:
        print(f"ERROR: Failed to parse LLM output as JSON: {e}")
        print("Raw output:")
        print(json_str)
        return

    # 4. Save JSON
    effective_date = target_date or datetime.date.today().isoformat()
    filename_dated = f"daily_payload_{effective_date}.json"
    filename_latest = "daily_payload.json"
    
    publications_dir = os.path.join(OUTPUT_DIR, "publications")
    os.makedirs(publications_dir, exist_ok=True)
    filepath_dated = os.path.join(publications_dir, filename_dated)
    filepath_latest = os.path.join(OUTPUT_DIR, filename_latest)  # keep root copy for backwards compat
    
    with open(filepath_dated, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        
    with open(filepath_latest, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    
    print(f"\nSUCCESS: Editor Agent synthesized daily graph.")
    print(f"Saved payload with {len(payload.get('articles', []))} articles to {filename_latest}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", help="Target date YYYY-MM-DD (filters vault files by filename prefix)")
    args = parser.parse_args()
    generate_daily_payload(target_date=args.date)

