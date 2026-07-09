# Architecture — Private LLMs on Mobile (tie-back)

This document links the runnable demo in this repo to the engineering-leader
[architecture brief](https://zulqurnainj.com) on deploying private LLMs on mobile.
It is a short, practitioner-level companion — the demo shows the inference path;
this shows the *decisions* around it.

## 1. The decision rule

```
if (privacy_class == HIGH || latency_budget < 200ms || offline_required):
    deploy_private_llm()        # this repo
elif (model_complexity > 65B || streaming_multimodal):
    cloud_gpu()
else:
    hybrid (guard rails + small on-device fallback)
```

This repo implements the first branch: a small (0.5B–3B) quantised model, fully
on-device, with no cloud dependency.

## 2. Patterns demonstrated here

| Pattern (brief) | Where in repo |
|---|---|
| **Quantised weights (INT4/Q4)** | `models.ts` ships only Q4_K_M GGUFs — ~4× smaller than FP16 at minimal loss |
| **Layer sharding CPU + NPU** | `OnDeviceLLM.load` sets `n_gpu_layers: 99`; runtime offloads to GPU/NPU when present |
| **Prompt + KV-cache** | `llama.rn` manages KV-cache per context; `clearCache` between sessions |
| **Context-only RAG** | Out of scope for the demo, but the same `completion()` call accepts retrieved context in `messages` |

## 3. Proven stack (brief §4) vs this repo

| Layer | Brief recommendation | This repo |
|---|---|---|
| Runtime | llama.cpp / MLC LLM | **llama.cpp via llama.rn** (verified) |
| UI/State | Jetpack Compose + ViewModel | **React Native + hooks** (cross-platform parity) |
| DI | Hilt | React context / refs |
| Observability | Firebase Perf + MLKit | On-device latency metrics in `InferenceMetrics` |

The runtime choice is identical. The UI layer is swapped to React Native because the
asset we're proving is *"private LLM + RN"* specifically — the cross-platform case.

## 4. Risks & mitigations (brief §7) → demo handling

- **SoC thermal throttling** — demo keeps `n_predict` small; production should
  scope batches to cool-down windows.
- **APK size bloat** — GGUFs are git-ignored and downloaded at runtime, not baked in.
- **Cold-start latency** — `use_mlock: true` pins weights; a production app would
  pre-load a tiny fallback model and lazy-load the full quant.

## 5. Benchmark your SoC

The brief's next step #2 ("run 1B vs 3B, measure throughput") is exactly what the
on-screen metrics do: pick a model → load → generate → read `tokensPerSec` and
`firstTokenMs` on *your* device. That's the empirical data you'd bring to a
go/no-go on edge-AI.
