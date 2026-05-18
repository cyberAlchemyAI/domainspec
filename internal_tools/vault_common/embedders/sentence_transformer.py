"""Opt-in `Embedder` backed by sentence-transformers.

Per OQ-D (vault_common SPEC), this concrete implementation lives OUTSIDE
the kernel surface. The kernel exports only the `Embedder` Protocol from
`vault_common.embedder`. Subsystems and tests that want this implementation
must import it explicitly:

    from vault_common.embedders.sentence_transformer import (
        SentenceTransformerEmbedder,
    )

This file is the ONLY place the kernel package names the
`sentence-transformers` library and a HuggingFace model id. Adding another
provider (OpenAI, Cohere, ...) means adding a sibling file under
`vault_common.embedders.` — not modifying the kernel `Embedder` Protocol.
"""

from __future__ import annotations


class SentenceTransformerEmbedder:
    """Real embedder backed by sentence-transformers. Lazy model load.

    Note on the default model name. Per the user memory
    `feedback_llm_agnostic_design.md`, designs must be LLM-agnostic. The
    Protocol surface (`vault_common.embedder.Embedder`) carries no model
    name. The default below exists only because this file is itself one
    concrete, opt-in implementation; callers SHOULD pass an explicit
    `model_name` rather than relying on the default.
    """

    def __init__(
        self,
        model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
        device: str = "cpu",
        cache_dir: str | None = None,
    ):
        self._model_name = model_name
        self._device = device
        self._cache_dir = cache_dir
        self._model = None
        self._dim_cached: int | None = None

    def _ensure_model(self):
        if self._model is None:
            # Import deferred: keeps `import vault_common.embedders` cheap
            # and avoids forcing the heavy dep on consumers that never
            # construct this class.
            from sentence_transformers import SentenceTransformer

            self._model = SentenceTransformer(
                self._model_name, device=self._device, cache_folder=self._cache_dir,
            )
            self._dim_cached = int(self._model.get_sentence_embedding_dimension())
        return self._model

    @property
    def dim(self) -> int:
        if self._dim_cached is None:
            self._ensure_model()
        assert self._dim_cached is not None
        return self._dim_cached

    def embed(self, text: str) -> list[float]:
        vec = self._ensure_model().encode(text, normalize_embeddings=True)
        return vec.tolist()

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        vecs = self._ensure_model().encode(
            texts, normalize_embeddings=True, batch_size=32,
        )
        return [v.tolist() for v in vecs]
