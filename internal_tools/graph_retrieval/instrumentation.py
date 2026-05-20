"""Feature-scoped OTel instruments and `@instrumented` decorator.

Implements the instrument catalogue declared in
features/two-layer-retrieval/spec/observability.md and the decorator
contract from features/observability/spec/interfaces.md.

Instruments are module-level singletons that resolve their meter lazily,
so importing this module before `configure_observability()` is a no-op.
"""

from __future__ import annotations

import functools
import hashlib
import inspect
import logging
import time
from typing import Any, Callable, TypeVar

from vault_common.otel import _ensure_configured

F = TypeVar("F", bound=Callable[..., Any])

_FEATURE_ATTR = "two-layer-retrieval"
_log = logging.getLogger("graph_retrieval")


# ----- Lazy meter / instrument resolution -------------------------------

def _meter():
    from opentelemetry import metrics
    _ensure_configured()
    return metrics.get_meter("domainspec", schema_url=None)


def _tracer():
    from opentelemetry import trace
    _ensure_configured()
    return trace.get_tracer("domainspec", schema_url=None)


class _LazyInstrument:
    """Lazy wrapper — resolves the underlying instrument on first use."""

    def __init__(self, builder: Callable[[Any], Any]):
        self._builder = builder
        self._instrument: Any = None

    def _resolve(self) -> Any:
        if self._instrument is None:
            self._instrument = self._builder(_meter())
        return self._instrument

    def add(self, amount: int | float, attributes: dict[str, Any] | None = None) -> None:
        self._resolve().add(amount, attributes or {})

    def record(self, value: int | float, attributes: dict[str, Any] | None = None) -> None:
        self._resolve().record(value, attributes or {})


# ----- Instrument catalogue (observability.md) -------------------------

retrieve_invocation = _LazyInstrument(
    lambda m: m.create_counter(
        "retrieve.invocation",
        unit="{invocation}",
        description="Counts retrieve() calls, grouped by intent and outcome",
    )
)

retrieve_duration = _LazyInstrument(
    lambda m: m.create_histogram(
        "retrieve.duration",
        unit="ms",
        description="Wall-clock duration of retrieve()",
    )
)

retrieve_candidate_set_size = _LazyInstrument(
    lambda m: m.create_histogram(
        "retrieve.candidate_set_size",
        unit="{node}",
        description="How many candidates the retriever scored (before top-k)",
    )
)

retrieve_intent_fallback = _LazyInstrument(
    lambda m: m.create_counter(
        "retrieve.intent.fallback",
        unit="{fallback}",
        description="SEMANTIC fallback hits — rule classifier missed",
    )
)

retrieve_unimplemented_intent = _LazyInstrument(
    lambda m: m.create_counter(
        "retrieve.unimplemented_intent",
        unit="{occurrence}",
        description="NotImplementedError raises (e.g. LENS_TRIANGULATION)",
    )
)

# Faithfulness guards — only ever incremented under DEBUG mode
f1_violation = _LazyInstrument(
    lambda m: m.create_counter(
        "retrieve.faithfulness.f1_violation",
        unit="{violation}",
        description="F1 (typed-edge preservation) violations",
    )
)

f4_violation = _LazyInstrument(
    lambda m: m.create_counter(
        "retrieve.faithfulness.f4_violation",
        unit="{violation}",
        description="F4 (model-recall in CANON) violations",
    )
)


# ----- @instrumented decorator -----------------------------------------

def _query_hash(query: str) -> str:
    return hashlib.sha256(query.encode("utf-8")).hexdigest()[:12]


def _pick(d: dict[str, Any], keys: tuple[str, ...]) -> dict[str, Any]:
    return {k: d[k] for k in keys if k in d and d[k] is not None}


def _result_attrs(result: Any, keys: tuple[str, ...]) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for k in keys:
        v = getattr(result, k, None)
        if v is None:
            continue
        # Enums → their string value
        out[k] = v.value if hasattr(v, "value") and hasattr(v, "name") else v
    return out


def instrumented(
    name: str,
    *,
    attributes_from_args: tuple[str, ...] = (),
    attributes_from_result: tuple[str, ...] = (),
    duration_instrument: _LazyInstrument | None = None,
) -> Callable[[F], F]:
    """Span + duration histogram + structured log around a function call.

    See features/observability/spec/interfaces.md for the full contract.
    """

    def decorator(fn: F) -> F:
        sig = inspect.signature(fn)
        param_names = tuple(sig.parameters)
        duration = duration_instrument or retrieve_duration

        @functools.wraps(fn)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            bound: dict[str, Any] = dict(zip(param_names, args))
            bound.update(kwargs)
            arg_attrs = _pick(bound, attributes_from_args)
            base_attrs: dict[str, Any] = {"feature": _FEATURE_ATTR, **arg_attrs}

            tracer = _tracer()
            from opentelemetry import trace
            start = time.perf_counter()
            with tracer.start_as_current_span(name) as span:
                for k, v in base_attrs.items():
                    span.set_attribute(k, str(v))
                try:
                    result = fn(*args, **kwargs)
                except Exception as exc:
                    duration_ms = (time.perf_counter() - start) * 1000
                    duration.record(duration_ms, base_attrs)
                    span.set_status(trace.Status(trace.StatusCode.ERROR, str(exc)))
                    span.record_exception(exc)
                    _log.error(
                        "%s.failed", name,
                        extra={"obs": {
                            "event": f"{name}.failed",
                            **base_attrs,
                            "error_class": type(exc).__name__,
                            "error_message": str(exc),
                            "query_hash": _query_hash(str(bound.get("query", ""))),
                        }},
                    )
                    raise

                duration_ms = (time.perf_counter() - start) * 1000
                result_attrs = _result_attrs(result, attributes_from_result)
                for k, v in result_attrs.items():
                    span.set_attribute(k, str(v))
                duration.record(duration_ms, {**base_attrs, **{
                    k: str(v) for k, v in result_attrs.items() if k in ("intent", "backend")
                }})

                # Build the canonical log envelope
                log_payload = {
                    "event": f"{name}.completed",
                    **base_attrs,
                    **result_attrs,
                    "duration_ms": int(duration_ms),
                    "query_hash": _query_hash(str(bound.get("query", ""))),
                }
                notes = getattr(result, "notes", None) or []
                if notes:
                    log_payload["notes"] = list(notes)
                    _log.warning(f"{name}.completed", extra={"obs": log_payload})
                else:
                    _log.info(f"{name}.completed", extra={"obs": log_payload})
                return result

        return wrapper  # type: ignore[return-value]

    return decorator
