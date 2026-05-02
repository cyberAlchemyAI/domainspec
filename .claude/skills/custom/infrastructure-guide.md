---
tags: [infrastructure, local, prod, gcp, docker, deploy]
node_type: reference
is_session: false
layer: architecture
nature: reference
status: active
version: 0.2.0
last_updated: 2026-04-21
---

# Infrastructure Guide

## Local Dev Stack

Start with: `docker compose -f docker-compose.dev.yml up --build`

| Service | Image | Port | Role |
|---|---|---|---|
| postgres | postgres:15 | 5433→5432 | Primary DB |
| redis | redis:7-alpine | 6379 | Celery broker + cache |
| minio | minio/minio | 9000 (API), 9001 (console) | S3-compatible object storage |
| api | Dockerfile (python:3.12-slim + tesseract-ocr) | 8000 | Django + Gunicorn, hot-reload |
| celery_worker | same image | — | Queues: `default`, `remessa-validation`, `remessa-recovery`, `bulk-import` |
| celery_beat | same image | — | Periodic task scheduler |
| frontend | frontend/Dockerfile (node:20-alpine + pnpm) | 5173 | Vite + React; proxy config hardcoded in `vite.config.js` (`/api` → `localhost:8000`). ⚠️ `VITE_PROXY_TARGET` is set in compose but **not read** by vite — proxy works on host, not inside Docker container. Also has stale `/v2` → `localhost:3000` proxy for deprecated `backend_ts`. |

**Local-only behaviors:**
- `DEBUG=true`, auto-migrate + superuser creation on api startup
- Minio buckets `remessas` and `documents` are auto-created by `minio-init`. ⚠️ Prod has a third bucket (`downloads`) that is **not** created locally — code using downloads will fail against Minio.
- `STORAGE_BACKEND` is unset → defaults to Minio (via `MINIO_ENDPOINT`)
- `REMESSA_BATCH_ROLLOUT=true` is set on api, celery_worker, and celery_beat — **not present in prod** (dev-only feature flag)

---

## Prod Stack (GCP — `southamerica-east1`)

| Component | GCP Service | Detail |
|---|---|---|
| API | Cloud Run (`zefra-hub-api`) | Public HTTPS via Global LB. Served on `api.zefra.app` (primary) and `zefra.com.br`. Managed SSL cert `zefra-hub-ssl-cert-v6` covers `api.zefra.app` only — apex and `www.zefra.app` must NOT terminate on this LB (see Frontend row). CORS allows: `localhost:5173`, `zefrahub.com` (http+https), `www.zefrahub.com`, `app.zefrahub.com`, `front-zefrahub.vercel.app`, `zefra.com.br`, `www.zefra.com.br`, `zefra.app`, `www.zefra.app`, `app.zefra.app` |
| Worker | GCE MIG (`zefra-hub-worker-mig`) | Celery in Docker on a VM, SSH-deployed via `deploy-worker.sh` |
| DB | Cloud SQL Postgres | Private VPC, static IP `192.168.0.3` |
| Cache | Memorystore Redis | Private VPC, static IP `192.168.1.3` |
| Storage | GCS | 3 buckets: `zefra-491412-remessas`, `zefra-491412-documents`, `zefra-491412-downloads` |
| Frontend | Vercel (`house-project`) | Separate deploy on push to `main`. Served on `zefra.app` (apex A → `216.198.79.1`) and `www.zefra.app` (CNAME → `cname.vercel-dns.com`). The `zefra.app` DNS zone is Google Cloud DNS (`zefra-app-zone`), but apex + www records are managed **manually** — Terraform intentionally does not own them (see Terraform note below). |
| Secrets | Secret Manager | `django-secret-key`, `postgres-app-password`, `redis-auth-string`, `gemini-api-key`, `email-host-password` |
| Images | Artifact Registry | `southamerica-east1-docker.pkg.dev/{PROJECT_ID}/zefra-hub-prod/zefra-hub:{sha}` |
| IaC | Terraform | `specs/cloud_services/iac/gcp-infrastructure-migration.tf` |

**Cloud Run Jobs** (batch, not long-running):
| Job | Trigger | Purpose |
|---|---|---|
| `django-migrate` | every deploy (pre-API) | Schema migrations |
| `zefra-bulk-import-worker` | dispatched by API | Parallel doc import (20 parallelism, up to 10k tasks) |
| `zefra-remessa-upload-{small,medium,large}` | dispatched by API | Tiered CPU/memory upload processing |

**Prod-only behaviors:**
- `STORAGE_BACKEND=gcs` → uses GCS instead of Minio
- `DEBUG=false`
- `USE_CLOUD_RUN_JOBS=true` — API dispatches bulk import and remessa upload to Cloud Run Jobs instead of Celery
- Worker deploys via SSH, not Cloud Run
- DB and Redis are VPC-private — GitHub runners and local machines cannot reach them directly

**Bulk import tuning (in `cloud-run-env.sh`):**
- `CLOUD_RUN_SAFE_TASKS_PER_EXECUTION=9500` — safety throttle below the 10k max
- `BULK_IMPORT_DISPATCH_MAX_RETRIES=10` — retry limit for job dispatch

**Secrets by consumer:**
| Secret | API | Worker | CR Jobs |
|---|---|---|---|
| `django-secret-key` | ✓ | ✓ | ✓ |
| `postgres-app-password` | ✓ | ✓ | ✓ |
| `redis-auth-string` | ✓ | ✓ | ✓ |
| `gemini-api-key` | ✓ | ✓ | ✓ |
| `email-host-password` | ✓ | — | — |

**DNS ownership (`zefra.app` zone):**
| Record | Points to | Owned by |
|---|---|---|
| `zefra.app.` (apex) A | `216.198.79.1` (Vercel) | ⚠️ Manual — Terraform does NOT manage |
| `www.zefra.app.` CNAME | `cname.vercel-dns.com.` (Vercel) | ⚠️ Manual — Terraform does NOT manage |
| `api.zefra.app.` A | Global LB IP (`35.244.171.4`) | Terraform (`app_api_a`) |

The zone itself (`zefra-app-zone`) IS managed by Terraform, but apex/www records were explicitly removed from TF on 2026-04-21 after commit `03605ed3` accidentally claimed them (see `docs/vault/conversations/2026-04-21-1600-zefra-app-routing-fix.md`). Any future `terraform apply` that reintroduces `google_dns_record_set.app_apex_a` or `app_www_a` will hijack Vercel traffic — do not re-add these.

The managed SSL cert `zefra-hub-ssl-cert-v6` on the LB covers **only** `api.zefra.app`. Do not add apex or www back to this cert — they never terminate TLS on this LB.

---

## Local ↔ Prod Equivalences

| Local | Prod | Gap? |
|---|---|---|
| Minio (`minio:9000`) | GCS | ⚠️ Minio has 2 buckets (`remessas`, `documents`); prod has 3 (`+downloads`) |
| Postgres (`postgres:5433`) | Cloud SQL (`192.168.0.3`) | — |
| Redis (`redis:6379`) | Memorystore (`192.168.1.3`) | — |
| `STORAGE_BACKEND` unset | `STORAGE_BACKEND=gcs` | — |
| `REMESSA_BATCH_ROLLOUT=true` | not set | Feature flag exists only in dev |
| Superuser auto-created | Manual or migration seeded | — |

---

## Deploy Pipeline (push to `main`)

```
build (Docker → Artifact Registry)
  └─ migrate (Cloud Run Job: django-migrate)
       ├─ deploy-api (Cloud Run service) ─── smoke-test (GET /health/ with retry) ──┐
       ├─ deploy-bulk-import-job (CR Job update) ─── deploy-worker (SSH via IAP) ───┤
       └─ deploy-remessa-upload-job (3 CR Jobs, matrix) ────────────────────────────┤
                                                                                    └─ verify
```
Note: `deploy-api`, `deploy-bulk-import-job`, and `deploy-remessa-upload-job` run **in parallel** after migrate. `deploy-worker` waits only for `deploy-bulk-import-job` (not deploy-api). `smoke-test` only waits for `deploy-api`.

**Shared env config:** `.github/scripts/cloud-run-env.sh` — single source of truth for all Cloud Run Job env vars. `deploy-api` has its own inline copy (keep in sync manually).

**Rollback:** `workflow_dispatch` with `deploy_sha` input skips build and redeploys an existing image tag.

---

## Key Files

| Purpose | File |
|---|---|
| Local services | `docker-compose.dev.yml` |
| Prod services (legacy/nginx) | `docker-compose.prod.yml` — ⚠️ still references deprecated `backend_ts` + `nginx`; not used for GCP deploy |
| API image | `Dockerfile` |
| Frontend image | `frontend/Dockerfile` |
| Deploy pipeline | `.github/workflows/deploy-gcp.yml` |
| CR Job env vars | `.github/scripts/cloud-run-env.sh` |
| Worker SSH deploy | `.github/scripts/deploy-worker.sh` |
| Custom Postgres image (unused?) | `Dockerfile.postgres` |
| Nginx image (legacy) | `nginx/Dockerfile` |
| Terraform (all GCP resources) | `specs/cloud_services/iac/gcp-infrastructure-migration.tf` |