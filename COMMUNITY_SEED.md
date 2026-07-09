# Community Seeding Copy — "On-Device LLM + React Native"

**Repo (replace `REPO_URL` after publish):** `https://github.com/Zulqurnain/on-device-llm-rn`
**Author:** Zulqurnain Haider — Senior Mobile Engineer / Gen AI Engineer
**Core proof:** a real LLM running 100% offline inside React Native (llama.cpp via `llama.rn`),
sub-2s cold start, zero cloud egress.

Seed order: **Tier-1 first** (r/LocalLLaMA, r/reactnative, r/expo), then discords, then MY-SG
communities. NO owner gate — these are public posts, not DMs.

---

## 1. r/LocalLLaMA (Tier-1)
**Title:** Ran a real LLM fully on-device inside React Native — sub-2s cold start, zero cloud
**Body:**
Sharing a minimal, runnable proof: a React Native (Expo) app that loads a Q4_K_M GGUF via
llama.cpp (`llama.rn`) and streams completions with **no server and no API key**. On-screen
metrics show cold-start, time-to-first-token, and tok/s measured on-device, and it keeps
answering with airplane mode on. Curated edge-ready model list (Qwen2.5 0.5B–3B, Llama-3.2,
SmolLM2) + an architecture tie-back. Repo: `https://github.com/Zulqurnain/on-device-llm-rn`. Curious how others handle thermal
throttling / APK-size on mobile — what's your approach?

## 2. r/reactnative (Tier-1)
**Title:** On-device LLM in RN — offline, zero-cloud, sub-2s cold start (minimal demo repo)
**Body:**
Wrote a small Expo demo that runs a private LLM entirely on-device using `llama.rn`
(llama.cpp). The interesting bit for RN folks: it goes through JSI (no bridge serialization),
offloads layers to the SoC GPU/NPU via `n_gpu_layers`, and measures latency on-device.
Weights download once over WiFi and live in the app sandbox. Repo + a 6-min walkthrough:
`https://github.com/Zulqurnain/on-device-llm-rn`. Would love RN-specific feedback on cold-start strategies.

## 3. r/expo (Tier-1)
**Title:** Expo + llama.rn: a working offline LLM demo (New Architecture, GPU offload)
**Body:**
Proof repo for running llama.cpp in an Expo app with the New Architecture. Covers expo-file-system
download-once model caching, `n_gpu_layers` GPU offload with CPU fallback, and on-device latency
metrics. `npm install && npm run typecheck && npm start`. Repo: `https://github.com/Zulqurnain/on-device-llm-rn`. If you've shipped
native modules in Expo, keen to hear how you handled the llama.rn prebuild step.

## 4. Discord — ONNX Runtime / llama.cpp communities
**Message (pinned in #showcase or #projects):**
`On-device LLM + RN proof repo — llama.cpp via llama.rn, fully offline, sub-2s cold start.
Curated Q4_K_M model list + measured tok/s on-device. Repo: https://github.com/Zulqurnain/on-device-llm-rn`

## 5. MY-SG startup communities (KL Tech / Found8 / MyDigitalMaker)
**LinkedIn-aware post (also usable in community Slack/Telegram):**
"Most 'AI' mobile features quietly ship your users' data to a cloud API. We built the opposite:
a React Native app where the LLM runs *on the phone* — offline, zero-cloud, sub-2s cold start.
It's a public proof repo (https://github.com/Zulqurnain/on-device-llm-rn) with on-device latency metrics and an architecture brief.
If you're building in fintech/health where data-localisation matters, I'd love to compare notes."

---

## Posting checklist
- [x] Replace `REPO_URL` with the published GitHub URL.
- [x] **Tier-5 LinkedIn / MY-SG post — PUBLISHED** (Zernio brand `linkedin`, 2026-07-09).
      Post URL: https://www.linkedin.com/feed/update/urn:li:share:7481025731171483648/
- [ ] Tier-1 Reddit posts (r/LocalLLaMA, r/reactnative, r/expo) — BLOCKED: no Reddit credentials in this env.
- [ ] ONNX Runtime / llama.cpp Discord #showcase — BLOCKED: only internal Job Wizard Discord tokens exist.
- [ ] Reply to every comment within 24h (proof > broadcast) — owner to action once Reddit/Discord posts go live.
- [ ] Track inbound (stars, DMs, read-through requests) for the founder-DM follow-up.
