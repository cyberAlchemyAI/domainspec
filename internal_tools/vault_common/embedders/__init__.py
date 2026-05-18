"""Opt-in concrete `Embedder` implementations.

Per OQ-D and the user memory `feedback_llm_agnostic_design.md`, the kernel
exports ONLY the `Embedder` Protocol from `vault_common.embedder`.
Provider-specific implementations live here and must be imported explicitly
by the consumer (subsystem or test). Importing `vault_common` itself MUST
NOT pull in any provider library (e.g. `sentence_transformers`,
`openai`, ...).

Each concrete implementation is one file. Adding a new one does not change
the kernel surface.
"""
