# Craft Consultation API

A private, checkout-local HTTP adapter for the accepted read-only Craft WaveDB
snapshot. It exposes four GET routes on loopback and has no registry
dependencies.

## Start

From the repository root:

```sh
/home/vrondelli/.nvm/versions/node/v26.6.0/bin/node \
  implementation/domainspec/tools/craft-consultation-api/src/main.cjs \
  --port 8787
```

The service binds only to `127.0.0.1`. Stop it with `Ctrl-C`; managed shutdown
rechecks the accepted inputs and removes only its disposable runtime copy.

## Read API

```text
GET /v1/status
GET /v1/verify
GET /v1/ledgers?prefix=<optional manifest-path prefix>
GET /v1/ledgers/:id/raw
```

`/v1/ledgers` returns the opaque `id` required by the raw route. IDs are strict
canonical base64url encodings of manifest-declared ledger paths; callers cannot
supply filesystem paths or WaveDB keys.

Example:

```sh
curl -s http://127.0.0.1:8787/v1/status
curl -s http://127.0.0.1:8787/v1/verify
curl -s 'http://127.0.0.1:8787/v1/ledgers?prefix=arcanum/'
curl -s http://127.0.0.1:8787/v1/ledgers/PASTE_ID_HERE/raw
```

Unknown routes and unknown or malformed ledger IDs return `404`. Invalid list
queries return `400`. Snapshot, manifest, record, or reader failures return a
sanitized typed `503` response without raw bytes or internal paths. Non-GET
methods return `405`.

## Validation and boundary

```sh
/home/vrondelli/.nvm/versions/node/v26.6.0/bin/node --test \
  implementation/domainspec/tools/craft-consultation-api/test/server.test.cjs
```

Startup verifies the completed reader receipt and source hashes, the Node 26
binary, local `@vijayee/wavedb@0.15.9` module/addon, accepted import receipt,
28 canonical ledger identities, and original snapshot digest. WaveDB opens only
an exclusive disposable copy below the completed experiment's `.work/` root.

This is an unauthenticated local experiment API. It does not add writes, auth,
Docker, external binding, deployment, publication, production hardening, or a
new source of Craft authority. Canonical `.craft/ledger.yml` files remain the
authority and WaveDB remains a derived read model.
