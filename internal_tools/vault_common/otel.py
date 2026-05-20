"""Kernel-pure OpenTelemetry seam.

Subsystem-neutral. Owns ONLY:

- The `ExporterChoice` taxonomy (NOOP / CONSOLE / OTLP).
- `configure_observability()` — sets the process-wide `MeterProvider`,
  `TracerProvider`, and a root JSON log handler.
- `current_state()` — introspection for tests and runbooks.

Feature-specific concerns (custom enum modes, feature-named loggers,
feature-scoped env vars) belong in the feature's own module. The kernel
honors only standard `OTEL_*` env vars.

Per `embedders/` and `frontmatter.py`, optional dependencies (OTLP
exporter) are imported inside the branch that needs them, never at
module top-level.
"""

from __future__ import annotations

import atexit
import logging
import os
from dataclasses import dataclass
from enum import Enum
from typing import Any


class ExporterChoice(str, Enum):
    NOOP = "noop"
    CONSOLE = "console"
    OTLP = "otlp"


@dataclass(frozen=True)
class MeterProviderState:
    exporter: ExporterChoice
    configured: bool
    provider_id: str


_state: MeterProviderState | None = None
_meter_provider: Any = None
_tracer_provider: Any = None
_shutdown_done: bool = False


def _read_env_exporter() -> ExporterChoice:
    raw = (os.environ.get("OTEL_EXPORTER") or "").strip().lower()
    try:
        return ExporterChoice(raw) if raw else ExporterChoice.NOOP
    except ValueError:
        return ExporterChoice.NOOP


def _install_root_json_handler(level: str) -> None:
    """JSON formatter on the root logger. All subsystem loggers inherit it."""
    import json

    class _JsonHandler(logging.StreamHandler):
        _kernel_owned = True

        def format(self, record: logging.LogRecord) -> str:
            payload: dict[str, Any] = {
                "level": record.levelname,
                "logger": record.name,
            }
            extra = getattr(record, "obs", None)
            if isinstance(extra, dict):
                payload.update(extra)
            else:
                payload["message"] = record.getMessage()
            return json.dumps(payload, default=str)

        def emit(self, record: logging.LogRecord) -> None:
            try:
                super().emit(record)
            except (ValueError, OSError):
                # stderr closed at interpreter shutdown (e.g. pytest atexit) — swallow
                pass

    root = logging.getLogger()
    root.handlers = [h for h in root.handlers if not getattr(h, "_kernel_owned", False)]
    h = _JsonHandler()
    h._kernel_owned = True  # type: ignore[attr-defined]
    h.setLevel(level)
    root.addHandler(h)
    root.setLevel(level)


def _build_provider(exporter: ExporterChoice) -> tuple[Any, Any]:
    from opentelemetry.sdk.metrics import MeterProvider
    from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor

    metric_readers: list[Any] = []
    span_processors: list[Any] = []

    if exporter == ExporterChoice.CONSOLE:
        from opentelemetry.sdk.metrics.export import ConsoleMetricExporter
        from opentelemetry.sdk.trace.export import ConsoleSpanExporter
        metric_readers.append(PeriodicExportingMetricReader(
            ConsoleMetricExporter(), export_interval_millis=30_000,
        ))
        span_processors.append(BatchSpanProcessor(ConsoleSpanExporter()))

    elif exporter == ExporterChoice.OTLP:
        try:
            from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
            from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
        except ImportError as e:
            raise ModuleNotFoundError(
                "OTLP exporter requested but opentelemetry-exporter-otlp is not installed. "
                "Install the `observability-otlp` extra."
            ) from e
        metric_readers.append(PeriodicExportingMetricReader(
            OTLPMetricExporter(), export_interval_millis=60_000,
        ))
        span_processors.append(BatchSpanProcessor(OTLPSpanExporter()))

    mp = MeterProvider(metric_readers=metric_readers)
    tp = TracerProvider()
    for sp in span_processors:
        tp.add_span_processor(sp)
    return mp, tp


def _install(mp: Any, tp: Any) -> None:
    from opentelemetry import metrics, trace
    metrics.set_meter_provider(mp)
    trace.set_tracer_provider(tp)


def _shutdown() -> None:
    global _meter_provider, _tracer_provider, _shutdown_done
    if _shutdown_done:
        return
    # Silence OTel SDK's "shutdown can only be called once" warning at process
    # exit — it tries to write to stderr after pytest has closed it.
    otel_logger = logging.getLogger("opentelemetry")
    prior_level = otel_logger.level
    otel_logger.setLevel(logging.ERROR)
    try:
        for p in (_meter_provider, _tracer_provider):
            if p is not None:
                try:
                    p.shutdown()
                except Exception:
                    pass
    finally:
        otel_logger.setLevel(prior_level)
    _shutdown_done = True


def configure_observability(
    exporter: ExporterChoice = ExporterChoice.NOOP,
    log_level: str = "INFO",
    *,
    force: bool = False,
) -> MeterProviderState:
    """Configure the process-wide OTel providers. Idempotent only with `force=True`."""
    global _state, _meter_provider, _tracer_provider, _shutdown_done

    if not isinstance(logging.getLevelName(log_level), int):
        raise ValueError(f"invalid log_level: {log_level!r}")

    if _state is not None and _state.configured and not force:
        raise RuntimeError(
            "observability already configured; pass force=True to override"
        )

    _shutdown()
    _shutdown_done = False  # new provider lifecycle starts now
    mp, tp = _build_provider(exporter)
    _install(mp, tp)
    _install_root_json_handler(log_level)
    _meter_provider = mp
    _tracer_provider = tp
    _state = MeterProviderState(
        exporter=exporter,
        configured=True,
        provider_id=hex(id(mp)),
    )
    return _state


def _ensure_configured() -> MeterProviderState:
    """Lazy-init from env on first call from outside if user hasn't configured."""
    global _state
    if _state is not None:
        return _state
    return configure_observability(exporter=_read_env_exporter(), force=False)


def current_state() -> MeterProviderState:
    return _ensure_configured()


@atexit.register
def _flush_on_exit() -> None:
    _shutdown()
