"""Query intent taxonomy and (rule-based MVP) classifier."""

from __future__ import annotations

import re
from enum import Enum


class Intent(str, Enum):
    CANON = "canon"                # "what do we believe?"
    PROVENANCE = "provenance"      # "what's the evidence for X?"
    FRONTIER = "frontier"          # "what's being explored?"
    TENSION = "tension"            # "what contradicts Y?"
    SEMANTIC = "semantic"          # "anything near X"
    BLAST_RADIUS = "blast_radius"  # "what breaks if I retire Z?"
    LENS_TRIANGULATION = "lens_triangulation"  # "what angles bear on X?"
    DEFINITIONAL = "definitional"  # "what does T mean here?"


_RULES: list[tuple[re.Pattern[str], Intent]] = [
    (re.compile(r"\bwhat do we believe\b|\bcanon\b|\bcurrently believe\b", re.I), Intent.CANON),
    (re.compile(r"\bevidence for\b|\bsupports?\b|\bderives? from\b", re.I), Intent.PROVENANCE),
    (re.compile(r"\bexplor(e|ing)\b|\bworking on\b|\bdraft\b|\bfrontier\b", re.I), Intent.FRONTIER),
    (re.compile(r"\bcontradict\w*\b|\brefute\w*\b|\bdisagree\w*\b|\btension\w*\b", re.I), Intent.TENSION),
    (re.compile(r"\bbreaks?\b|\bdepends on\b|\bblast radius\b|\bimpact of\b", re.I), Intent.BLAST_RADIUS),
    (re.compile(r"\blens(es)?\b|\btriangulat\w*\b|\bangles?\b", re.I), Intent.LENS_TRIANGULATION),
    (re.compile(r"\bdefin(e|ition)\b|\bmean(s|ing)?\b|\bglossary\b", re.I), Intent.DEFINITIONAL),
]


def classify_intent(query: str) -> Intent:
    """Rule-based MVP classifier. Falls back to SEMANTIC on no rule match."""
    for pattern, intent in _RULES:
        if pattern.search(query):
            return intent
    return Intent.SEMANTIC
