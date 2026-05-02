---
name: domainspec-infra-architecture
description: Define or evolve infrastructure architecture constitution for a DomainSpec project. Detects existing infra, recommends preset, asks minimal questions, produces INFRA-ARCHITECTURE.md, scaffolds IaC + CI/CD + monitoring stack.
argument-hint: "[--preset dev|single-vps|split-vps|ha] [--update]"
agent: domainspec-infra-architect
allowed-tools: Read, Write, Bash, Glob, Grep, AskQuestions, WebFetch, Task
---

<objective>
Produce a complete infrastructure architecture constitution (docs/INFRA-ARCHITECTURE.md), scaffold IaC, CI/CD workflows, and monitoring stack before any deployment work begins.
</objective>

<context>
Source references:
- domainspec/CHANGELOG.md
- domainspec/templates/infra-architecture.md
- domainspec/templates/slos.md
- domainspec/templates/setup.sh

Detection targets:

- docker-compose\*.yml
- Dockerfile, .dockerignore
- infra/, infrastructure/, deploy/
- Pulumi.yaml, Pulumi.\*.yaml
- \*.tf, terraform/
- .github/workflows/\*.yml
- Caddyfile, nginx.conf, traefik.\*
- prometheus.yml, grafana/
- docs/features/\*/observability.md

Output:

- docs/INFRA-ARCHITECTURE.md
- docs/slos.md (linked to feature observability specs)
- infra/ directory scaffold (based on preset)
- infra/setup.sh (automated VPS provisioning script, preset >= single-vps)
- .github/workflows/ CI/CD pipelines (if preset >= single-vps)
  </context>

<presets>
DomainSpec infrastructure uses graduated presets. Each preset is a complete, opinionated stack.
The skill recommends a preset based on detection signals, then asks the user to confirm or override.

## Preset: Dev

- Runtime: Docker Compose (local only)
- IaC: None
- Monitoring: Prometheus + Grafana in compose
- CI/CD: None
- Deploy: `docker compose up`
- Scaffold:
  - Extend existing docker-compose.yml with prometheus + grafana services
  - Generate prometheus.yml from observability specs
  - Generate grafana provisioning (datasource + dashboard stubs)

## Preset: Single VPS

- Default VPS: DigitalOcean (best ergonomics, good API)
- Runtime: Docker Compose on remote VPS
- IaC: Pulumi (TypeScript — matches project stack)
- Reverse Proxy: Caddy (auto-TLS, zero cert management)
- Monitoring: Prometheus + Grafana (in compose, behind Caddy)
- CI/CD: GitHub Actions (build → test → containerize → deploy)
- Container Registry: GitHub Container Registry (ghcr.io)
- Deploy: `git push main` → auto-deployed
- Manual inputs: 3 secrets (DO token, Cloudflare token, Pulumi token)
- Scaffold:
  - infra/Pulumi.yaml + index.ts (provision droplet + DNS + firewall)
  - infra/cloud-init.yaml (bootstrap Docker on VPS)
  - infra/docker-compose.prod.yml (full stack)
  - infra/Caddyfile (reverse proxy with auto-TLS)
  - infra/prometheus.yml (auto-generated from observability specs)
  - infra/grafana/provisioning/ (datasources + dashboards)
  - Dockerfile per service (backend, web)
  - .github/workflows/ci.yml (PR checks + pulumi preview)
  - .github/workflows/deploy.yml (push to main → deploy)

### Add-on: Agent Runner (optional, preset >= single-vps)

Available when the project uses the DomainSpec tuning loop. Adds:

- Self-hosted GitHub Actions runner on the VPS (systemd service)
- Sandboxed container image for agent execution (no production secrets)
- Claude Code CLI for automated reflection and tuning proposals
- infra/agent-runner-setup.sh (idempotent runner registration + auth)
- infra/agent-runner/Dockerfile (sandboxed execution environment)
- .github/workflows/domainspec-tuning.yml agent-reflect job
- Additional secrets: GH_PAT_AGENT (repo + workflow scope)

Enable when: project has `docs/signals/pipeline-signals.jsonl` and `domainspec/claude/skills/domainspec-reflect/SKILL.md`.

## Preset: Split VPS

- Extends Single VPS with:
  - Separate database VPS (or managed DB)
  - Staging environment
  - Loki for log aggregation
  - Promotion gates (staging → production)
  - DB backup automation

## Preset: HA

- Extends Split VPS with:
  - Managed database (DigitalOcean Managed PostgreSQL)
  - Load balancer
  - Multiple app replicas
  - Canary deployment workflow
  - Full OTel stack (metrics + logs + traces)
    </presets>

<process>
1. Read domainspec/CHANGELOG.md and extract current-framework constraints.
2. Read domainspec/templates/infra-architecture.md.
3. Read domainspec/templates/slos.md.
4. Detect existing infrastructure:
   - Docker Compose files, Dockerfiles
   - IaC projects (Pulumi, Terraform)
   - CI/CD workflows (.github/workflows/)
   - Reverse proxy configs (Caddy, nginx)
   - Monitoring configs (prometheus.yml, grafana/)
   - Feature observability specs (docs/features/*/observability.md)
5. Check for docs/INFRA-ARCHITECTURE.md:
   - If exists → enter **update mode** (diff and apply changes).
   - If missing → enter **create mode** (full setup).
6. Recommend preset based on signals:
   - No infra detected → recommend **Dev**
   - Has docker-compose but no IaC → recommend **Single VPS**
   - Has features with `pillar: finance` → recommend at least **Single VPS** (monitoring mandatory)
   - Has multiple services → recommend **Split VPS**
   - Has --preset flag → use specified preset
7. Use AskQuestions tool — maximum 3 questions:
   - Q1: "Confirm preset: {recommended}?" (show preset table, pre-select)
   - Q2: "Domain name?" (only if preset >= single-vps)
   - Q3: "DigitalOcean region?" (default: nyc1, show top options)
   - Skip questions answered by detection or --preset flag
8. Fill infra-architecture.md template with detection + user answers.
9. Write docs/INFRA-ARCHITECTURE.md.
10. Collect all observability.md files and generate docs/slos.md:
    - One section per feature with O-rule targets
    - Prometheus alert expressions auto-derived
11. Scaffold based on preset:

### Dev Scaffold

a. Extend docker-compose.yml with prometheus + grafana services.
b. Generate infra/prometheus.yml from observability specs (scrape app:9464).
c. Generate infra/grafana/provisioning/datasources/prometheus.yml.
d. Run `docker compose config` to validate.

### Single VPS Scaffold (includes Dev scaffold plus:)

a. Create infra/Pulumi.yaml (project config).
b. Create infra/index.ts:

- DigitalOcean Droplet (Ubuntu 24.04, size from config)
- DigitalOcean Firewall (80, 443, 22 only)
- Cloudflare DNS A record → droplet IP
- Cloudflare DNS A records for subdomains (grafana.{domain}, prometheus.{domain})
- Output: droplet IP, URLs
  c. Create infra/cloud-init.yaml:
- Install Docker + Docker Compose
- Create deploy user (no root SSH)
- Configure UFW firewall
- Pull and start compose stack
  d. Create infra/Pulumi.production.yaml (droplet size, region, domain).
  e. Create infra/docker-compose.prod.yml:
- app service (image from ghcr.io)
- web service (image from ghcr.io)
- postgres service (with volume)
- caddy service (with Caddyfile mount)
- prometheus service (with prometheus.yml mount)
- grafana service (with provisioning mount)
  f. Create infra/Caddyfile:
- app.{domain} → reverse proxy to app:3000
- grafana.{domain} → reverse proxy to grafana:3001
- Auto-TLS for all domains
  g. Create Dockerfile for backend:
- Multi-stage build (deps → build → runtime)
- Non-root user
- Health check endpoint
  h. Create Dockerfile for web:
- Multi-stage build (deps → build → static serve)
  i. Create .github/workflows/ci.yml:
- Trigger: pull_request
- Jobs: backend (install, lint, typecheck, test), web (install, lint, typecheck, build), infra-preview (pulumi preview, post as PR comment)
  j. Create .github/workflows/deploy.yml:
- Trigger: push to main
- Jobs: test (reuse ci steps), build-push (docker build + push to ghcr.io), deploy (pulumi up), health-check (curl app endpoint)
  k. Create infra/.env.example documenting required secrets.
  l. Install Pulumi dependencies: `cd infra && npm init -y && npm install @pulumi/pulumi @pulumi/digitalocean @pulumi/cloudflare`.
  m. Run `pulumi preview --stack dev` to validate IaC (dry run, no deploy).
  n. Run TypeScript compilation on infra/index.ts.
  o. Generate infra/setup.sh from domainspec/templates/setup.sh:
     - Replace `{project-name}` with actual project name.
     - Replace `{pulumi-project-name}` with Pulumi project name from Pulumi.yaml.
     - Replace `{app-dir}` with /opt/{project-name}.
     - Make executable: `chmod +x infra/setup.sh`.
     - The script automates: SSH key gen, Pulumi stack init, config, `pulumi up`, cloud-init wait, file copy, secret generation, deploy user setup, and prints GitHub Secrets summary.

### Split VPS Scaffold (extends Single VPS:)

a. Add second droplet for database in index.ts.
b. Add Loki + Promtail to docker-compose.prod.yml.
c. Add staging environment (Pulumi.staging.yaml).
d. Update deploy.yml with promotion gates.
e. Add DB backup cron job to cloud-init.

### HA Scaffold (extends Split VPS:)

a. Replace self-hosted PostgreSQL with DigitalOcean Managed Database in index.ts.
b. Add DigitalOcean Load Balancer.
c. Add multiple app replicas.
d. Add canary deploy workflow.

12. Return summary of created artifacts and next steps.
    </process>

<prometheus-generation>
The skill reads all `docs/features/*/observability.md` files and generates:

1. **infra/prometheus.yml** — scrape config targeting app OTel exporter
2. **infra/alerts/{feature}.rules.yml** — alert rules derived from slos.md thresholds

For each feature's observability.md:

- Parse instrument declarations (YAML blocks)
- Map O-rules to Prometheus metric names
- Cross-reference with slos.md targets
- Generate alert expressions with appropriate thresholds

Alert rule template:

```yaml
groups:
  - name: {feature}
    rules:
      - alert: {Feature}{MetricName}Breach
        expr: {prometheus_expression}
        for: 5m
        labels:
          severity: {p0|p1|p2}
          feature: {feature}
        annotations:
          summary: "{feature}: {metric} SLO breached"
          source_rule: {O-rule}
```

</prometheus-generation>

<graduation-triggers>
Include in INFRA-ARCHITECTURE.md a scaling roadmap section with:
- Current preset
- Graduation trigger table (when → what preset → what changes)
- Concrete migration checklist per graduation step
- Each checklist is executable: run `domainspec-infra-architecture --preset {next}` → Pulumi converges

Graduation is always non-destructive: Pulumi diffs and applies. No manual server migration.
</graduation-triggers>

<constraints>
- Maximum 3 interactive questions. Detect everything possible.
- Default VPS provider: DigitalOcean.
- Default DNS: Cloudflare (free tier).
- Default IaC: Pulumi with TypeScript.
- Default reverse proxy: Caddy (auto-TLS).
- Default container registry: ghcr.io.
- No notification integrations (Slack, Discord, etc.).
- Never expose database ports to the internet.
- Never store secrets in git — use Pulumi config or GitHub Actions secrets.
- All infrastructure changes through IaC — no SSH modifications.
- Health checks are mandatory in deploy pipeline.
- Prometheus scrape config auto-generated from observability specs.
</constraints>

<auto-detection>
This skill is auto-suggested by the planner when:
- A feature pipeline reaches verification and no INFRA-ARCHITECTURE.md exists
- Observability specs exist but no monitoring stack is configured
- The user asks about deployment, hosting, or monitoring setup
The user can also invoke it standalone.
</auto-detection>
