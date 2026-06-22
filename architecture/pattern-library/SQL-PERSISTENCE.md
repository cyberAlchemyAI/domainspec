---
tags: [architecture, pattern-library, sql, postgres, drizzle, migrations]
node_type: reference
is_session: false
layer: architecture
nature: obligation
status: active
version: 0.1.0
last_updated: 2026-06-21
---

# SQL Persistence Obligation

## Rule

When a DomainSpec Core project selects SQL persistence with PostgreSQL, the
default production persistence pattern is:

1. Model tables, enums, relations, and indexes in TypeScript with Drizzle ORM.
2. Generate migration SQL with Drizzle Kit.
3. Commit generated migration artifacts.
4. Run local, E2E, CI, and deployment database setup from those generated
   migration artifacts.

Hand-written duplicate schema SQL is not an acceptable production or E2E schema
source when a Drizzle schema exists.

## Accepted Shape

Each PostgreSQL-backed package or service should include:

- a Drizzle schema under its infrastructure layer;
- a `drizzle.config.ts` file pointing at that schema;
- package scripts for migration generation and application, such as
  `db:generate`, `db:push`, or `db:migrate`;
- a committed migration folder, usually `drizzle/`;
- Docker, E2E, and deployment flows that apply generated migrations rather than
  recreating the schema by hand.

## Allowed Raw SQL

Raw SQL is allowed when it is:

- emitted by Drizzle Kit as a generated migration artifact;
- a data-only fixture, cleanup, or assertion helper in tests;
- a narrow operational query that cannot reasonably be represented through
  Drizzle, with the reason documented next to the code.

Raw SQL is not allowed when it duplicates table, enum, relation, constraint, or
index creation that already belongs to the Drizzle schema and generated
migrations.

## Review Obligation

Any task that introduces or changes PostgreSQL persistence must answer:

- Where is the Drizzle schema?
- Which Drizzle Kit command generates the migration?
- Where is the generated migration committed?
- Which validation proves E2E and deployment setup consume generated migrations?
- If raw SQL exists, is it generated migration SQL, data-only fixture SQL, or a
  documented exception?

If any answer is missing, the task is not production-ready.
