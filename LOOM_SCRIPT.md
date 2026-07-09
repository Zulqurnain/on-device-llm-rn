# Loom Walkthrough Script — "On-Device LLM + React Native"

**Target length:** ~6 minutes. **Goal:** prove a real LLM runs 100% offline inside React Native,
and make engineering leaders want the repo + a technical read-through.

**Pre-recording checklist (do once, before you hit record):**
- [ ] Repo running on a real phone via Expo Go (Android with GPU ideal; iOS works too).
- [ ] One small model already downloaded (Qwen2.5-1.5B Q4_K_M — ~1 GB) so you don't wait on WiFi on camera.
- [ ] Phone in screen-mirror / Loom desktop capture so the device screen is visible.
- [ ] Airplane-mode toggle reachable on screen (for the offline proof).
- [ ] Repo open in an editor on the other half of the screen for the code tour.

---

### 0:00–0:30 — Hook (don't introduce yourself yet)
> "Here's a React Native app. I'm going to ask it a question, then turn on airplane mode,
> and it's still going to answer — because the LLM runs entirely on this phone.
> No API key, no server, nothing leaves the device. Let me show you."

Action: tap **Generate**, let a few tokens stream, then toggle airplane mode, tap **Generate** again.
Point at the on-screen metrics line (cold-start ms, first-token ms, tok/s).

### 0:30–1:30 — What this is + 30-second code tour
> "This is a minimal Expo app. The whole 'asset' is ~150 lines in `OnDeviceLLM.ts` — a thin
> wrapper over `llama.rn`, which is llama.cpp compiled to native. Three methods: `load`,
> `generate`, `release`. `load` times the cold start and sets `n_gpu_layers: 99` so the SoC
> GPU/NPU does the heavy lifting when present."

Action: open `src/llm/OnDeviceLLM.ts` (lines ~77–142). Highlight `initLlama({ n_gpu_layers: 99 })`
and the `firstTokenMs` / `tokensPerSec` measurement.

### 1:30–2:30 — The three numbers that are the proof
> "Cold-start here is under two seconds on first context. Time-to-first-token is sub-200ms on
> a 1.5B model. Throughput is X tok/s on-device. That's the empirical data you'd bring to a
> go/no-go on edge-AI — and it's measured on *your* hardware, not a benchmark someone else ran."

Action: scroll the metrics, mention you can switch models (Qwen 0.5B → 3B, Llama, SmolLM2 from `models.ts`).

### 2:30–4:00 — Live demo, end to end
> "Pick a model → Load → Generate. First launch downloads the GGUF over WiFi once; after that
> it's offline forever. Weights live in the app sandbox — grep the network and you'll see zero
> egress at inference time."

Action: switch to a second model, hit **Load**, then **Generate**. Read the new metrics live.
Call out `gpu: true` if NPU engaged.

### 4:00–5:00 — How it works (the 60-second version)
> "llama.cpp via `llama.rn` runs through JSI — no bridge serialization. INT4 / Q4_K_M quant
> makes a 1.5B model ~1 GB. `n_gpu_layers` shards layers to the NPU; CPU fallback is automatic.
> Prompt + KV-cache is managed per context. This mirrors the production patterns in the
> architecture brief — context-only RAG, layer sharding, thermal scoping."

Action: open `ARCHITECTURE.md` briefly, point at the decision-rule block.

### 5:00–6:00 — Why engineering leaders should care + CTA
> "If your concern is PII leaving the device, latency floors, or per-token serving cost, this
> is the pattern. Repo is public — link in the description. If your team is evaluating edge-AI
> on mobile, I'm happy to walk through it in a technical read-through. I'm Zulqurnain."

Action: show repo URL on screen, end on the contact line.

---

**Recording notes:**
- Loom captures your screen + voice. Record in one take if possible; the offline toggle is the
  money shot — make sure it's clearly visible.
- Keep the camera on the phone screen, not your face, for the demo segments.
- Upload to Loom, set title: "Private LLM inside React Native — fully offline, sub-2s cold start".
- Paste the repo link in the Loom description before sharing.
