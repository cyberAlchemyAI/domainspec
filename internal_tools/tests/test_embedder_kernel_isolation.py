"""Tests for OQ-D: kernel must not couple to provider libraries.

The kernel exports only the `Embedder` Protocol (and the test-fixture
`NullEmbedder`). Concrete provider-bound implementations live under
`vault_common.embedders.*` and must be imported explicitly.
"""

from __future__ import annotations

import subprocess
import sys
import textwrap


def _run_isolated(code: str) -> tuple[int, str, str]:
    """Run `code` in a fresh Python subprocess; return (rc, stdout, stderr)."""
    proc = subprocess.run(
        [sys.executable, "-c", code],
        capture_output=True,
        text=True,
    )
    return proc.returncode, proc.stdout, proc.stderr


def test_importing_vault_common_does_not_load_sentence_transformers() -> None:
    """The headline OQ-D guarantee: a kernel import must not pull the heavy
    `sentence_transformers` package into `sys.modules`."""
    code = textwrap.dedent(
        """
        import sys
        # Pre-poison: ensure no prior leaked import.
        assert 'sentence_transformers' not in sys.modules
        import vault_common  # noqa: F401
        from vault_common.embedder import Embedder, NullEmbedder  # noqa: F401
        if 'sentence_transformers' in sys.modules:
            print('LEAKED')
            raise SystemExit(1)
        print('CLEAN')
        """
    )
    rc, out, err = _run_isolated(code)
    assert rc == 0, f"isolation failed: stdout={out!r} stderr={err!r}"
    assert "CLEAN" in out


def test_importing_vault_common_embedders_subpackage_alone_is_cheap() -> None:
    """Even the `vault_common.embedders` package init must not load any
    provider lib. Only constructing a concrete class triggers the import."""
    code = textwrap.dedent(
        """
        import sys
        import vault_common.embedders  # noqa: F401
        if 'sentence_transformers' in sys.modules:
            print('LEAKED')
            raise SystemExit(1)
        print('CLEAN')
        """
    )
    rc, out, err = _run_isolated(code)
    assert rc == 0, f"isolation failed: stdout={out!r} stderr={err!r}"
    assert "CLEAN" in out


def test_concrete_sentence_transformer_class_is_importable() -> None:
    """Opt-in path stays available. (Construction may load the provider lib
    lazily on `_ensure_model`; we just verify the class symbol resolves.)"""
    from vault_common.embedders.sentence_transformer import SentenceTransformerEmbedder

    # Construction does NOT load the model — that is deferred to embed().
    inst = SentenceTransformerEmbedder(model_name="test-only-not-loaded")
    assert inst is not None


def test_null_embedder_still_lives_in_kernel_for_tests() -> None:
    """NullEmbedder is the protocol-pure test fixture — kept in the kernel
    on purpose. It MUST stay reachable from `vault_common.embedder`."""
    from vault_common.embedder import Embedder, NullEmbedder

    e = NullEmbedder(dim=4)
    assert e.dim == 4
    v = e.embed("hello")
    assert len(v) == 4
    # NullEmbedder satisfies the Protocol (structural).
    _: Embedder = e
