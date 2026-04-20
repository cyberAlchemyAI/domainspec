# Banking Finance — Domain Model Inventory

**Source:** SD-Banking
**Category:** C (System Design + DDD Event Sourcing)
**Reference:** DDD event sourcing banking examples; industry reference architecture
**Extracted:** 2026-04-20
**Confidence:** moderate
**Used in experiments:** E9 run-2 rerun (CD5)

> Banking domain reconstructed from DDD event sourcing patterns and industry architecture. Five bounded contexts with heavy regulatory enforcement (KYC, AML, sanctions), double-entry bookkeeping invariants, and a wire transfer saga. Highest enforces-cross edge density of all domains (5 edges).

---

## Bounded Contexts

| # | Context | Description | Aggregate Roots | Key Events | Persistence |
|---|---------|-------------|-----------------|------------|-------------|
| 1 | **Accounts** | Account opening, balance management, and lifecycle (active/frozen/closed). | Account, AccountBalance | AccountOpened, AccountFrozen | Event-sourced |
| 2 | **Transactions** | Transaction posting with double-entry bookkeeping. | Transaction, TransactionRecord | TransactionPosted, SuspiciousTransactionDetected | Event-sourced + ledger |
| 3 | **Transfers** | Inter-account and wire transfer orchestration. | Transfer | TransferInitiated, TransferCompleted | Saga-based |
| 4 | **Statements** | Periodic and on-demand statement generation from transaction history. | Statement | StatementGenerated | Read model |
| 5 | **Compliance/KYC** | Know Your Customer verification, AML monitoring, and sanctions screening. | KYCVerification, SanctionsCheck | KYCCompleted, SuspiciousActivityReported | Rule engine |

## Concept Inventory

| Concept | Meta-Type | Primary BC | Source Reference |
|---------|-----------|-----------|-----------------|
| Account | Entity | Transactions | DDD event sourcing examples; account→transaction reference |
| Transaction | Entity | Statements | DDD event sourcing; transaction→statement reference |
| AccountOpened | Event | Accounts | DDD banking examples; account→KYC trigger |
| SuspiciousTransactionDetected | Event | Transactions | DDD banking examples; fraud detection trigger |
| TransferCompleted | Event | Transfers | DDD banking examples; transfer completion→balance update |
| TransferInitiated | Event | Transfers | DDD event sourcing; transfer→transaction trigger |
| DoubleEntryRule | Rule | Accounts | DDD banking examples; double-entry enforcement |
| InsufficientFundsRule | Rule | Accounts | DDD banking examples; balance enforcement on transfers |
| KYCVerificationRule | Rule | Compliance/KYC | DDD banking examples; KYC enforcement on accounts |
| SanctionsCheckRule | Rule | Compliance/KYC | DDD banking examples; AML/sanctions enforcement |
| TransactionMonitoringRule | Rule | Compliance/KYC | DDD banking examples; transaction monitoring |
| WireTransferSaga | Saga | Accounts | DDD banking examples; wire transfer saga with compensation |
| AccountBalance | Value Object | Transactions | DDD event sourcing; transaction→account balance update |
| TransactionRecord | Value Object | Transactions | DDD banking examples; transaction→statement data |

## Cross-Context Edges

| # | Edge ID | Source BC | Target BC | Concept | Type | Edge Type | Pattern | Orig Status |
|---|---------|----------|-----------|---------|------|-----------|---------|-------------|
| 1 | CD5-E01 | Transactions | Accounts | Account | Entity | references | P2-entity-reference | works |
| 2 | CD5-E02 | Transactions | Accounts | AccountBalance | Value Object | produces-for | P1-data-handoff | strained |
| 3 | CD5-E03 | Transfers | Transactions | TransferInitiated | Event | triggers-cross | P3-event-trigger | broken |
| 4 | CD5-E04 | Statements | Transactions | Transaction | Entity | references | P2-entity-reference | works |
| 5 | CD5-E05 | Compliance/KYC | Accounts | KYCVerificationRule | Rule | enforces-cross | P5-cross-enforcement | strained |
| 6 | CD5-E06 | Compliance/KYC | Transfers | SanctionsCheckRule | Rule | enforces-cross | P5-cross-enforcement | strained |
| 7 | CD5-E07 | Compliance/KYC | Transactions | TransactionMonitoringRule | Rule | enforces-cross | P5-cross-enforcement | strained |
| 8 | CD5-E08 | Transactions | Compliance/KYC | SuspiciousTransactionDetected | Event | triggers-cross | P3-event-trigger | broken |
| 9 | CD5-E09 | Statements | Accounts | Account | Entity | references | P2-entity-reference | works |
| 10 | CD5-E10 | Transfers | Accounts | Account | Entity | references | P2-entity-reference | works |
| 11 | CD5-E11 | Accounts | Transfers | InsufficientFundsRule | Rule | enforces-cross | P5-cross-enforcement | strained |
| 12 | CD5-E12 | Transfers | Accounts | TransferCompleted | Event | triggers-cross | P3-event-trigger | broken |
| 13 | CD5-E13 | Accounts | Compliance/KYC | AccountOpened | Event | triggers-cross | P3-event-trigger | broken |
| 14 | CD5-E14 | Accounts | Transactions | DoubleEntryRule | Rule | enforces-cross | P5-cross-enforcement | strained |
| 15 | CD5-E15 | Accounts+Txn+Transfer+Stmt+KYC | Accounts+Txn+Transfer+Stmt+KYC | WireTransferSaga | Saga | orchestrates | P4-saga | broken |
| 16 | CD5-E16 | Transactions | Statements | TransactionRecord | Value Object | produces-for | P1-data-handoff | strained |

## Composition Patterns Exercised

| Pattern | Present? | Edge Count |
|---------|:--------:|----------:|
| P1-data-handoff | ✅ | 2 |
| P2-entity-reference | ✅ | 4 |
| P3-event-trigger | ✅ | 4 |
| P4-saga | ✅ | 1 |
| P5-cross-enforcement | ✅ | 5 |
| P6-shared-context | — | 0 |

## Meta-Type Coverage

| Meta-Type | Count | BCs |
|-----------|------:|-----|
| Rule | 5 | Accounts, Compliance/KYC |
| Event | 4 | Accounts, Transactions, Transfers |
| Entity | 2 | Statements, Transactions |
| Value Object | 2 | Transactions |
| Saga | 1 | Accounts |
