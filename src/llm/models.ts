import { ModelSpec } from './OnDeviceLLM'

/**
 * Curated starter set of small, edge-ready GGUF models (all Q4_K_M).
 * URLs are direct HuggingFace `resolve/main` links and were verified live
 * at repo-creation time. Sizes are approximate download MB.
 *
 * These are NOT committed to the repo (see .gitignore). The app downloads
 * them on first launch over WiFi; everything after that is offline.
 */
export const MODELS: ModelSpec[] = [
  {
    name: 'Qwen2.5-0.5B-Instruct (Q4_K_M)',
    url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf',
    sizeMb: 397,
    contextSize: 2048,
    isChat: true,
    note: 'Tinyest option. Sub-second cold start on most phones; great for latency demos.',
  },
  {
    name: 'Qwen2.5-1.5B-Instruct (Q4_K_M)',
    url: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf',
    sizeMb: 1083,
    contextSize: 4096,
    isChat: true,
    note: 'Best quality/size trade-off for a real assistant on mid-tier Android.',
  },
  {
    name: 'Qwen2.5-3B-Instruct (Q4_K_M)',
    url: 'https://huggingface.co/Qwen/Qwen2.5-3B-Instruct-GGUF/resolve/main/qwen2.5-3b-instruct-q4_k_m.gguf',
    sizeMb: 1927,
    contextSize: 4096,
    isChat: true,
    note: 'Higher quality; needs more RAM. Use on flagship SoCs with NPU offload.',
  },
  {
    name: 'Llama-3.2-1B-Instruct (Q4_K_M)',
    url: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
    sizeMb: 809,
    contextSize: 4096,
    isChat: true,
    note: 'Meta Llama-3.2 family. Strong instruction following at 1B scale.',
  },
  {
    name: 'Llama-3.2-3B-Instruct (Q4_K_M)',
    url: 'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
    sizeMb: 2014,
    contextSize: 4096,
    isChat: true,
    note: 'Solid general chat quality; pair with GPU/NPU offload on device.',
  },
  {
    name: 'SmolLM2-1.7B-Instruct (Q4_K_M)',
    url: 'https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct-GGUF/resolve/main/smollm2-1.7b-instruct-q4_k_m.gguf',
    sizeMb: 1121,
    contextSize: 4096,
    isChat: true,
    note: 'HuggingFace TinyLLM line. Compact and fast on CPU-only devices.',
  },
]

/** Default pick for the demo (small, fast, fully offline-friendly). */
export const DEFAULT_MODEL = MODELS[1]
