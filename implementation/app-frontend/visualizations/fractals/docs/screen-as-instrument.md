# Screen as Instrument — Multi-Element Audio Reactivity Discovery

> Discovery document. Surveys what other on-screen elements could be
> sound-driven, and which musical signals each could listen to. Not yet a
> spec — write one in `SPEC.md` (or a sibling capability) once the
> pairings below are picked.

## The idea in one sentence

The fractal alone is parameter-saturated (4 bands, 4 knobs); to use *more*
of the music without making any single element busier, expand to **more
elements** (background, edges, particles, HUD, whole-canvas effects) and
**more signals** (onsets, RMS, centroid, tempo, stereo) — then pair each
element with the aspect of the sound that fits it.

## Why a multi-element system instead of more fractal parameters

Adding a 5th band to the fractal either subdivides existing signals (more
granular but visually subtle) or piles motion onto a single focal element
(loses clarity). The richer move is a *system of co-listening elements*:
the fractal stays the centerpiece, and a small number of secondary layers
each pick up a different musical signal — contributing peripheral motion
that lets the user feel more of the song without competing for attention.

## Two taxonomies

### Element taxonomy (where things live)

| Layer                     | What's there today                                | What could go there                        |
| ------------------------- | ------------------------------------------------- | ------------------------------------------ |
| Focal canvas              | The fractal (already reactive)                    | —                                          |
| Frame / edge              | Nothing yet                                       | Vignette, side-gutter motion, edge glow    |
| Ambient layer (behind)    | Solid background                                  | Gradient haze, palette wash, faint stars   |
| Foreground particles      | Nothing yet                                       | Drifting motes, ash, spores, sparks        |
| Whole-canvas effects      | Dive zoom only                                    | Camera shake, hue rotation, zoom punch     |
| HUD / typography          | Static zoom / coord / iter readouts               | Glow pulse, scale bounce, opacity envelope |
| Cursor / pointer          | Default cursor                                    | Trails, ripples, click bursts              |

### Signal taxonomy (what aspects of the sound can drive them)

| Signal                        | What it captures                                                | Cost   | Already have? |
| ----------------------------- | --------------------------------------------------------------- | ------ | ------------- |
| 4-band energy                 | Sustained spectral content (sub/bass/mid/treble)                | done   | ✅            |
| Bass beat detector            | Rhythmic punch (rolling-avg threshold)                          | done   | ✅            |
| **Onset / spectral flux**     | Transient *attacks* (kicks, hats, snares) — distinct from steady energy | low    | ❌            |
| **RMS loudness**              | Overall volume envelope; perceived dynamics                     | trivial| ❌            |
| **Spectral centroid**         | Perceived "brightness" — where the energy is concentrated       | low    | ❌            |
| **Spectral spread**           | How concentrated vs. spread the spectrum is (sparse vs. dense)  | low    | ❌            |
| **Stereo balance**            | L/R energy difference (only meaningful for stereo files)        | low    | ❌            |
| **Silence / phrase detection**| Long quiet stretches; song breathing                            | trivial| ❌            |
| Tempo / BPM                   | Period of the song; long-window autocorrelation                 | medium | deferred to v2 |
| Pitch / fundamental           | Lead melodic note (only useful for monophonic content)          | medium | ❌            |

The bolded rows are the most-leveraged additions: each one is cheap to
compute and unlocks several element pairings below.

## Pairings — element × signal

This is the heart of the proposal. Each row is a candidate; commit to a
few, not all.

| Element                            | Signal                          | Effect                                                                              | Why it fits                                                                |
| ---------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Background gradient haze           | RMS loudness                    | Soft palette wash behind the fractal pulses opacity with overall energy             | Ambient envelope — quiet passages get visible space, loud passages get glow |
| Edge particles (motes / spores)    | Onset detection                 | Each transient spawns a short-lived particle drifting from a screen edge            | Hats and snares get a discrete visual moment without crowding the fractal  |
| Vignette intensity                 | Bass band (existing)            | Vignette darkens on bass hits, lifts on rests                                       | Reuses an existing signal in a non-competing layer                         |
| Camera shake (canvas translate)    | Bass beat (existing)            | Brief ≤ 2 px jitter on each detected beat                                           | Felt more than seen; doesn't disturb fractal geometry                      |
| Hue rotation on palette            | Spectral centroid               | Brighter sounds shift palette warmer or cooler **within its existing range**        | Subtle drift, not a theme change — palette stays recognizable              |
| Background star field drift        | Tempo (when available)          | Atmospheric stars drift faster on uptempo tracks                                    | Slow, only kicks in once tempo lock is stable                              |
| HUD readout glow                   | Treble band (existing)          | Top-right "iter" / "zoom" labels shimmer on hi-hat content                          | Tiny, peripheral — gives the HUD a heartbeat                               |
| Cursor trail length                | Spectral spread                 | Busy/wide mixes → longer trail; sparse mixes → stubby trail                         | Lets the user "feel" the density of the mix in their pointer               |
| Zoom punch (whole canvas)          | Composite onset (bass + transient) | Brief 1.02× scale flare lasting ~80 ms                                              | Adds cinematic emphasis to the heaviest hits                               |
| Iris dim / phrase break            | Silence detection               | Whole canvas dims to 70% during > 500 ms quiet stretches, lifts on next onset        | Makes song structure visible — verses, breaks, drops                       |
| Side-gutter sound bars             | Treble + mid bands              | Two thin animated columns at left/right edges showing band energy as breathing bars | Makes the spectrum *legible* without using on-fractal real estate          |

## Design principles for a multi-element system

A few rules that keep the system from collapsing into chaos:

1. **One focal element only.** The fractal is the centerpiece. Everything
   else stays at lower contrast and opacity (recommend ≤ 40%) and lives
   outside the fractal's main visual footprint.
2. **Each signal drives at most one element type.** Don't double-bind the
   bass beat to both vignette pulse and camera shake — pick one or the
   user reads it as redundant noise.
3. **Per-element opacity is user-controllable**, plus a master "ambient
   intensity" slider that scales everything outside the fractal. Same
   `localStorage` persistence pattern as `BandSensitivity`.
4. **Palette-aware, not palette-overriding.** Edge particles, haze, hue
   shift, and HUD glow all draw from the *active Ghibli palette's* RGB
   ramp — no new colors. This keeps visual identity coherent across themes.
5. **Quiet by default.** All ambient elements ship at low intensity and
   are individually disable-able. The first-time experience should still
   be "fractal that reacts to music"; the rest reveals itself when the
   user goes looking.
6. **No motion competes with the dive.** During an active dive, ambient
   elements either freeze or fade out — nothing should distract from
   falling through the fractal.

## Per-palette opportunities

Each Ghibli theme suggests a slightly different ambient vocabulary. The
system doesn't have to honor this, but doing so gives each theme more
identity. If we go this route, per-theme particle behavior should be
data-driven (a small palette-keyed table), not separate code paths.

| Theme           | Ambient suggestion                                            | Driven by                       |
| --------------- | ------------------------------------------------------------- | ------------------------------- |
| Totoro          | Soot-sprite particles drifting up from the bottom edge        | Onset detection                 |
| Spirited Away   | Lantern-light haze pulsing behind the fractal                 | RMS loudness                    |
| Mononoke        | Forest spores spiraling outward from the fractal center       | Tempo or spectral spread        |
| Howl            | Falling ash drifting diagonally                               | Treble band                     |
| Nausicaä        | Wind streaks across the top edge                              | Onset detection on high-mids    |

## Implementation cost ladder

Cheapest to most expensive, so we can pick a meaningful v1:

1. **HUD glow on treble** (~30 lines) — CSS filter on existing readouts; reuses Treble band.
2. **Vignette intensity on bass** (~30 lines) — single radial-gradient overlay; reuses Bass band.
3. **Camera shake on bass beat** (~20 lines) — `transform: translate()` on canvas wrapper; reuses beat detector.
4. **Background haze on RMS** (~50 lines + 1 new signal) — RMS computed from time-domain analyser data.
5. **Onset detector** (~80 lines + 1 new signal) — spectral flux between consecutive FFT frames; threshold + debounce. Foundational for particles.
6. **Edge particle layer** (~150–250 lines, depends on #5) — second `<canvas>` overlay; pooled particles to avoid GC.
7. **Spectral centroid → hue rotation** (~50 lines + 1 new signal) — small math addition; subtle visual.
8. **Side-gutter sound bars** (~60 lines) — two thin columns, two band energies; legible spectrum readout.
9. **Stereo balance shift** (~40 lines) — only useful for stereo audio; may need analyser graph fork.
10. **Tempo detection** (~150–300 lines, deferred from `movement-of-the-sound.md`) — biggest scope.

A pragmatic v1 of "Screen as Instrument": items **1–5** (vignette + camera
shake + HUD glow + ambient haze + onset detector) — roughly **200 lines**
across HTML/CSS/JS, two new cheap signals (RMS, onset), no fractal
modulation changes. Items 6–10 become v2.

## Open questions

1. **One canvas or two?** Foreground particles in DOM (cheap, easy) or in
   a second `<canvas>` (more flexible, GPU-friendly)? The fractal canvas
   is already busy; layering a second canvas on top is the cleanest
   separation.
2. **Master slider or per-element toggles?** A single "ambient intensity"
   knob is one decision; per-element on/off + intensity is N decisions
   and a panel that grows with each addition. Recommend master slider for
   v1, per-element controls behind a disclosure when count > 4.
3. **Mobile.** Particle counts and camera shake degrade poorly on weak
   GPUs. Cap counts on small viewports, or feature-detect and downgrade?
4. **Naming and structure.** "AudioReactivity" was the right name when
   only the fractal reacted. If the screen-wide system lands as the
   *same* capability, the SPEC.md AudioReactivity section will roughly
   double in size. Two cleaner alternatives: (a) split into sibling
   capabilities (`AudioReactivity` for the fractal, `AudioScene` for
   ambient elements) sharing a common analyser; (b) keep one capability
   but extract per-element rules into separate aspect files. Lean (a) —
   each capability stays under 100 lines and the analyser becomes
   reusable infrastructure.
5. **Telemetry surface.** Current rule is "aggregate per-session band
   averages only." Do new signals (RMS, centroid, onset count) each get
   their own session aggregate, or fold into a single
   `audio_session_summary` event? Folding keeps the privacy story simple.
6. **Behavior under audio stop.** When audio is unloaded, all ambient
   elements should fade to their idle baseline within one frame — same
   discipline as the existing slider revert. Worth specifying explicitly
   so the implementer doesn't leave half-running RAF loops behind.

## Suggested next step

Pick 3–5 pairings from the matrix that match what you want the page to
*feel* like during a song — then we either:

- run `/domainspec-spec-feature AudioReactivity --update` to add the
  picked pairings as new aspects to the existing capability, or
- run `/domainspec-spec-feature AudioScene` to spec a sibling capability
  that consumes the shared analyser.

The discovery is "done" when you can answer in concrete terms: *what
should the screen look like during a quiet verse vs. during the drop?*
