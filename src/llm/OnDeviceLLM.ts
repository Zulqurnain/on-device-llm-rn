import { initLlama, LlamaContext, loadLlamaModelInfo } from 'llama.rn'

export type ModelSpec = {
  /** Display name, e.g. "Qwen2.5-0.5B-Instruct (Q4_K_M)" */
  name: string
  /** HuggingFace GGUF download URL (direct file link). */
  url: string
  /** Approx download size in MB, shown to the user before fetch. */
  sizeMb: number
  /** Recommended context window for this model. */
  contextSize: number
  /** True if the model has a chat/instruction template (chat mode). */
  isChat: boolean
  /** Short note on why this model is a good edge fit. */
  note: string
}

/**
 * A single measured inference run. These numbers ARE the proof:
 * load (cold-start) latency, first-token latency, and tokens/sec.
 */
export type InferenceMetrics = {
  /** ms from calling initLlama to context ready (cold start). */
  loadMs: number
  /** ms from prompt submit to first streamed token. */
  firstTokenMs: number
  /** generated tokens / wall-clock generation seconds. */
  tokensPerSec: number
  /** total tokens generated. */
  tokens: number
  /** whether GPU/NPU offload engaged on this device. */
  gpu: boolean
}

const STOP_WORDS = [
  '</s>',
  '<|end|>',
  '<|eot_id|>',
  '<|end_of_text|>',
  '<|im_end|>',
  '<|EOT|>',
  '<|END_OF_TURN_TOKEN|>',
  '<|end_of_turn|>',
  '<|endoftext|>',
]

/**
 * OnDeviceLLM wraps llama.rn in a tiny, testable surface:
 *   - load a GGUF into a llama.cpp context (timed cold start)
 *   - stream completion token-by-token (timed)
 *   - release on unmount
 *
 * Nothing here ever touches a network at inference time.
 */
export class OnDeviceLLM {
  private ctx: LlamaContext | null = null
  private loadMs = 0

  get loaded(): boolean {
    return this.ctx !== null
  }

  get gpuEnabled(): boolean {
    return this.ctx?.gpu ?? false
  }

  /** Inspect a GGUF before loading (metadata only, no weights in RAM). */
  async inspect(path: string): Promise<unknown> {
    return loadLlamaModelInfo(path)
  }

  /**
   * Load a GGUF into a llama.cpp context. Times the cold start.
   * `n_gpu_layers: 99` offloads every eligible layer to the SoC GPU/NPU
   * on capable devices; on others llama.cpp transparently falls back to CPU.
   */
  async load(path: string, contextSize = 2048): Promise<boolean> {
    const t0 = Date.now()
    this.ctx = await initLlama({
      model: path,
      use_mlock: true,
      n_ctx: contextSize,
      n_gpu_layers: 99,
    })
    this.loadMs = Date.now() - t0
    return this.ctx.gpu
  }

  /**
   * Generate a completion, streaming each token to `onToken`.
   * Returns full text + latency metrics. When `system` is provided the call
   * uses the model's chat template; otherwise raw prompt completion is used.
   */
  async generate(
    prompt: string,
    onToken: (token: string, partial: string) => void,
    options?: { system?: string; maxTokens?: number },
  ): Promise<{ text: string; metrics: InferenceMetrics }> {
    if (!this.ctx) throw new Error('Model not loaded. Call load() first.')

    const messages =
      options?.system !== undefined
        ? [
            { role: 'system', content: options.system },
            { role: 'user', content: prompt },
          ]
        : undefined

    const tPrompt = Date.now()
    let firstTokenMs = -1
    let partial = ''
    let tokenCount = 0

    const result = await this.ctx.completion(
      {
        messages,
        prompt: messages ? undefined : prompt,
        n_predict: options?.maxTokens ?? 256,
        stop: STOP_WORDS,
        temperature: 0.7,
        top_p: 0.9,
      },
      (data) => {
        if (firstTokenMs < 0) firstTokenMs = Date.now() - tPrompt
        tokenCount += 1
        partial += data.token
        onToken(data.token, partial)
      },
    )

    const genMs = Date.now() - tPrompt
    const tokensPerSec = tokenCount > 0 ? (tokenCount / genMs) * 1000 : 0

    const metrics: InferenceMetrics = {
      loadMs: this.loadMs,
      firstTokenMs,
      tokensPerSec,
      tokens: tokenCount,
      gpu: this.ctx.gpu,
    }
    return { text: result.text ?? partial, metrics }
  }

  /** Release the native context (call on unmount / model switch). */
  async release(): Promise<void> {
    if (this.ctx) {
      await this.ctx.release()
      this.ctx = null
    }
  }
}

export { STOP_WORDS }
