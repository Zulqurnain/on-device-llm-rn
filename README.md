# On-Device LLM + React Native (Proof Repo)

> **Private LLMs in your pocket — offline, zero-cloud, sub-2s cold start.**
> A minimal, runnable React Native (Expo) demo that runs a real LLM **entirely on-device**
> using [`llama.rn`](https://github.com/mybigday/llama.rn) (llama.cpp bindings). No API keys,
> no server, no network at inference time. This is the demonstrable asset behind
> *"ship AI features without sending user data to the cloud."*

This repo is the working proof for the [Private LLMs on Mobile architecture brief](./ARCHITECTURE.md).
It is intentionally small — the point is to show the **on-device inference path end-to-end**, not to
ship another chat portal.

---

## What it does

1. Picks a small GGUF model (Qwen2.5 / Llama-3.2 / SmolLM2, all Q4_K_M).
2. Downloads it **once** over WiFi into app storage (never committed — see `.gitignore`).
3. Loads it into a llama.cpp context via `llama.rn` (timed cold start).
4. Streams tokens from a real completion, **measuring latency on-device**:
   - `loadMs` — cold-start latency to first context
   - `firstTokenMs` — time-to-first-token
   - `tokensPerSec` — decode throughput
   - `gpu` — whether SoC GPU/NPU offload engaged
5. After the first load, **it works with airplane mode on.**

```
User prompt ──▶ llama.rn (JSI) ──▶ llama.cpp ──▶ CPU / GPU(NPU) on the SoC
                    ▲
                    └── GGUF weights live in app sandbox; no network egress
```

## Why this matters (for engineering leaders)

| Concern | On-device (this repo) | Cloud LLM API |
|---|---|---|
| PII leaving the device | **Never** | Always (prompt + context) |
| Latency floor | 50–200 ms (1B class) | + round-trip (network) |
| Serving cost | ~$0 (runs on the phone) | Per-token, recurring |
| Offline / spotty 4G | ✅ works | ❌ |
| Data-localisation (GDPR, fintech) | ✅ by construction | Needs extra controls |

This mirrors the patterns in the architecture brief: **quantised weights (INT4/Q4)**,
**prompt + KV-cache**, **context-only RAG**, and **SoC layer sharding** (`n_gpu_layers`).

## Run it

```bash
npm install            # fetches llama.rn + prebuilt native artifacts (iOS/Android)
npm run typecheck      # tsc --noEmit
npm start              # expo dev server
# then: scan QR with Expo Go, or `npm run android` / `npm run ios`
```

First launch downloads the chosen ~400 MB–2 GB GGUF. After that, toggle airplane mode
and tap **Generate** — it still answers.

> Requires React Native **New Architecture** (enabled by default in Expo 54 / RN 0.81).
> `llama.rn@0.12.5` needs it. For GPU offload on Android, `n_gpu_layers: 99` is set in
> [`src/llm/OnDeviceLLM.ts`](./src/llm/OnDeviceLLM.ts); the runtime falls back to CPU
> transparently on devices without an OpenCL/Hexagon-capable GPU.

## Repo layout

```
App.tsx                      Minimal UI: model picker, prompt, live output, metrics
src/llm/OnDeviceLLM.ts       The asset: load + stream-completion wrapper over llama.rn
src/llm/models.ts            Curated edge-ready GGUF list (verified download URLs)
src/hooks/useOnDeviceLLM.ts  Download-once + load + generate lifecycle
ARCHITECTURE.md              Tie-back to the private-LLM-on-mobile brief
LOOM_SCRIPT.md               6-min walkthrough script (timed talking points + demo beats)
COMMUNITY_SEED.md            Copy + target shortlist for seeding to RN/Expo/local-LLM communities
```

## Beyond the demo (production patterns)

The brief covers the harder parts this demo deliberately leaves out, including:
- **APK size control** — ship the model as a dynamic feature module, download on first launch over WiFi.
- **Thermal throttling** — scope inference to cool-down windows; pre-warm on foreground resume.
- **Cold-start** — keep a lightweight fallback model; lazy-load the full quant when idle.
- **Fallback policy** — what happens before the model finishes downloading.

---

Built by **Zulqurnain Haider** — Senior Mobile Engineer / Gen AI Engineer.
If your team is evaluating edge-AI on mobile, I'm happy to walk through this in a technical read-through.
• zulqurnainjj@gmail.com • +923364116933 • https://zulqurnainj.com • https://linkedin.com/in/zulqurnainjj

---

## Open to work (founder / eng-direct inbound)

I'm actively exploring remote Senior AI + Mobile Engineer roles -- on-device LLM, RAG, React Native / Flutter. If your team is building AI features where data-localisation, offline use, or per-token serving cost matters, I'd love a technical read-through.

- Proof repo (always-live hub): https://github.com/Zulqurnain/on-device-llm-rn
- LinkedIn: https://linkedin.com/in/zulqurnainjj
- Email: zulqurnainjj@gmail.com
