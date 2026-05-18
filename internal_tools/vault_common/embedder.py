"""Embedder Protocol — the only thing the kernel ships for embeddings.

Per OQ-D and the user memory `feedback_llm_agnostic_design.md`, the kernel
declares NO provider, NO model name, NO API. Concrete implementations live
under `vault_common.embedders.*` and consumers import them explicitly.

`NullEmbedder` stays here because it is protocol-pure (deterministic
SHA-256 stub, zero dependencies). It is a TEST FIXTURE — it has no
production use; do not import it from non-test code.
"""

from __future__ import annotations

from typing import Protocol


class Embedder(Protocol):
    @property
    def dim(self) -> int: ...

    def embed(self, text: str) -> list[float]: ...

    def embed_batch(self, texts: list[str]) -> list[list[float]]: ...


class NullEmbedder:
    """Test-only stub. Deterministic hash-based vector; zero dependencies.

    NOT for production use. Concrete production embedders live under
    `vault_common.embedders.*` and must be imported explicitly.
    """

    def __init__(self, dim: int = 8):
        self._dim = dim

    @property
    def dim(self) -> int:
        return self._dim

    def embed(self, text: str) -> list[float]:
        import hashlib

        h = hashlib.sha256(text.encode("utf-8")).digest()
        return [(b - 128) / 128.0 for b in h[: self._dim]]

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        return [self.embed(t) for t in texts]
