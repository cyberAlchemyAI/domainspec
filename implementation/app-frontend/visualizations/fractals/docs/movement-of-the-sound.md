# Movement of the Sound — Audio-Reactive Fractal Discovery

> Discovery document. Captures the idea, design choices, and open questions
> for letting any song drive the Julia fractal's parameters in real time.
> Not yet a spec — write one in `SPEC.md` once the questions below are
> answered.

## The Idea in One Sentence

Load any audio file (or live mic), split its spectrum into four frequency
bands, and let each band continuously modulate one of the existing fractal
parameters — so the fractal *moves with the music* instead of being driven
by sliders or the sine-wave `advanceParamTravel` loop.

## Why It Works Musically

The fractal already has four expressive controls, and music naturally
decomposes into four perceptually distinct frequency layers. The mapping
isn't arbitrary — each band carries a kind of musical information that
matches what each parameter does to the fractal:

| Band         | Hz range    | Carries                 | Parameter                | Why it fits                                                        |
| ------------ | ----------- | ----------------------- | ------------------------ | ------------------------------------------------------------------ |
| Sub-bass     | 20–150 Hz   | kick drum, sub          | `diveSpeed` (Queda)      | Kick literally pushes you deeper into the fractal                  |
| Bass         | 150–500 Hz  | basslines, low body     | `radius` r (Essência)    | Bassline pulses the "weight" of the constant c                     |
| Mid          | 500–2000 Hz | vocals, lead melody     | `theta` θ (Espírito)     | Melody rotates the fractal's personality angle                     |
| Treble       | 2–8 kHz     | hi-hats, cymbals, air   | `iterBase` (Profundidade)| High-frequency sparkle adds iteration detail                       |

The result should feel like the fractal is *listening* — bass thumps make
it breathe outward, the melody twists its character, hi-hats sharpen its
edges, and the kick pulls you down into it.

## Two Design Models — Pick One Before Building

### A. Direct mapping
```
parameter = baseline + gain × bandEnergy
```
- Pro: visceral, immediate, "bass hit = visible jolt"
- Con: during quiet passages the fractal collapses to baseline and stops moving
- Con: large gain values fight the user's slider position

### B. Modulation mapping (recommended)
```
parameter drifts continuously (like advanceParamTravel today),
and bandEnergy modulates the drift's amplitude and speed
```
- Pro: motion never dies during silence — the fractal still breathes
- Pro: the existing `advanceParamTravel` at
  [fractal-ghibli.html:1428](../fractal-ghibli.html#L1428) is already this
  exact shape; we just replace the constant phase coefficients with
  audio-driven ones
- Pro: feels musical instead of mechanical
- Con: less of a 1:1 "I see the bass hit" sensation
- Mitigation: keep a per-band sensitivity slider so the user can dial
  toward direct or toward subtle

**Recommendation: Model B**, with sensitivity controls per band so the
user can crank specific bands toward direct response when they want a
visible beat reaction.

## Integration Points in the Existing Code

Everything we need to hook into already exists:

- Parameters live on sliders ([fractal-ghibli.html:496-532](../fractal-ghibli.html#L496))
  and are read by name in `currentParams()` and the render path. Writing
  to `slTheta.value`, `slRadius.value`, etc. and calling `syncParamLabels()`
  is exactly what `advanceParamTravel` already does.
- `advanceParamTravel(now)` at
  [fractal-ghibli.html:1428](../fractal-ghibli.html#L1428) is the perfect
  template — it's already a per-frame "modulate sliders by smooth motion"
  loop. We add `advanceFromAudio(now)` next to it (or fold them together).
- `diveLoop()` at
  [fractal-ghibli.html:1501](../fractal-ghibli.html#L1501) calls
  `advanceParamTravel`. We call our audio advancer from the same place,
  and add an analogous always-on RAF loop for non-dive playback that
  throttles `scheduleRender()` calls.
- Telemetry already emits `parameter_changed`, `param_travel_toggled`,
  etc. — adding `audio_loaded`, `band_energy_sample`, `audio_session_started`
  fits the existing pattern in `server.mjs`.

## Web Audio Pipeline Sketch

```
<input type="file" accept="audio/*">  →  <audio> element
    │
    ▼
AudioContext.createMediaElementSource(audio)
    │
    ▼
AnalyserNode  (fftSize: 1024, smoothingTimeConstant: 0.8)
    │
    ├──► destination (so the song is audible)
    │
    └──► getByteFrequencyData(buf) per RAF tick
              │
              ▼
       4 band-energy values  (mean over each band's bin range)
              │
              ▼
       EMA smoothing per band   (0.85 prev + 0.15 current)
              │
              ▼
       Modulate slider values   (write back, syncParamLabels(), maybe scheduleRender())
```

A Web Audio context can only be created on a user gesture, so the
file-picker click is what initializes everything.

## UX Surface to Add

Minimal additions to the existing controls bar
([fractal-ghibli.html:484-565](../fractal-ghibli.html#L484)):

- File picker (or drag-drop zone) accepting any audio MIME
- Audio `<controls>` element so the user can play/pause/scrub
- Toggle button "♪ Tocar com a música" (replaces or coexists with
  "✦ Variar função")
- Four small sensitivity sliders (one per band) — default 50%, range
  0–100%. Could collapse behind a "tuning" disclosure to keep the bar
  uncluttered
- Optional: live mini spectrum readout (4 bars) so the user can see
  the fractal is actually receiving the song

## Open Questions to Resolve Before Building

1. **Render throttling under audio drive.** At deep zoom, a full render
   takes 100–500 ms. Audio updates at 60 Hz. We can't `scheduleRender()`
   per audio tick. Options: (a) cap audio-driven re-renders to 10 Hz,
   (b) only update sliders per-tick and let the existing render
   throttle handle it, (c) split parameters — palette-only changes are
   cheap and can react per-frame, geometry changes (θ, r) react slower.
2. **Beat detection — yes or no?** A simple energy-spike beat detector
   could trigger discrete events (theme cycle, dive burst). Worth
   building, or does continuous modulation already capture "the beat"?
3. **Mic input.** Same `AnalyserNode` API; `getUserMedia({audio:true})`
   swaps for the file source. Free addition or scope creep?
4. **What happens to the existing "Variar função" mode?** Coexist
   (audio overrides if loaded), replace, or layer (audio modulates the
   sine-wave drift instead of replacing it)?
5. **Persistence.** Should the user's loaded song survive a page
   refresh? Probably not — but the four sensitivity values likely
   should via `localStorage`.
6. **Telemetry sensitivity.** Audio amplitude is potentially personal
   data ("they listened to a quiet song at 2am"). Default to *off* for
   audio-related telemetry, or aggregate to per-session band averages
   only?

## What "Done" Looks Like for a First Version

- User can load any local audio file in under 5 seconds of interaction
- Pressing play makes the fractal visibly react within ~200 ms
- During silence the fractal still moves (modulation, not direct)
- Four sensitivity sliders meaningfully change how strongly each band
  pulls its parameter
- Existing slider drag, dive, theme switching, and reset all still work
  while audio is playing
- No regression in render throughput at any zoom level when audio is
  loaded but paused

## Out of Scope (For Now)

- Multi-track / stem separation (drums vs. vocals vs. bass as separate
  inputs)
- Tempo (BPM) detection driving dive speed
- Saving "performances" — recording slider trajectories alongside audio
- Streaming from URLs (CORS complications)
- MIDI input as an alternative driver

## Suggested Next Step

Decide question 1 (render throttling strategy) and question 4
(coexistence with `advanceParamTravel`). Those two answers fully
determine the loop structure of `advanceFromAudio`. Once they're picked,
the rest can be drafted into a proper `SPEC.md` capability —
provisionally `AudioReactivity` — and built behind a query-param flag
(`?audio=1`) so it stays opt-in until it's stable.
