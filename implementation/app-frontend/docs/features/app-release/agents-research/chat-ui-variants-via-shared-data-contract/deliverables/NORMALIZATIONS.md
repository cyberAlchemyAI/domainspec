---
tags: [app-release, ui, normalizations, data-contract]
node_type: conceptual
is_session: false
layer: application, architecture
nature: descriptive
status: active
version: 1.1.0
last_updated: 2026-05-01
---

# Normalizations — Chat UI Variants Data Contract

> **TEMPLATE AUTHORS, PARENT AUTHORS:** This is the single source of truth for normalization rules used across [CHAT-PAYLOAD-SCHEMA.md](./CHAT-PAYLOAD-SCHEMA.md), [ELEMENT-TAXONOMY.md](./ELEMENT-TAXONOMY.md), and [INJECTION-CONTRACT.md](./INJECTION-CONTRACT.md). Every datum that crosses the parent ↔ template boundary obeys the rules below. Server emits normalized values; clients render them as-is.

## Timestamps

ISO-8601 with explicit timezone offset (e.g. `2026-05-01T13:41:19-03:00`). Server emits, never client. Millisecond precision max; never microsecond. UI may format for display but never re-emits a different format.

## IDs

UUID v4 lowercase, hyphenated standard form (`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`). Sessions, messages, tool-uses, file-ops all share this format.

## File paths

POSIX-style, relative to workspace root, no leading `./`, no trailing slash. Use forward slashes always, including on Windows backends.

## Enums

lowercase snake_case (`active`, `ended`, `pending`, `success`, `error`, `info`, `success`, `warning`).

## Strings

NFC Unicode, trimmed of leading/trailing whitespace. pt-BR with proper diacritics (`ç`, `ã`, `é`, `ó`).

## Numbers

integers for counts (`stats.nodes`, `stats.edges`, etc.). Floats only for impact/score values.

## Booleans

explicit `true`/`false`, never `null` or omitted to mean false. Optional booleans must have a documented default in the schema.
