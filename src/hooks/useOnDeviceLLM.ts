import { useEffect, useRef, useState } from 'react'
import { File, Paths } from 'expo-file-system'
import { DEFAULT_MODEL, MODELS } from '../llm/models'
import { InferenceMetrics, ModelSpec, OnDeviceLLM } from '../llm/OnDeviceLLM'

export type Phase =
  | 'idle'
  | 'downloading'
  | 'loading'
  | 'ready'
  | 'generating'
  | 'error'

export function useOnDeviceLLM() {
  const llmRef = useRef<OnDeviceLLM | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [downloading, setDownloading] = useState(false)
  const [model, setModel] = useState<ModelSpec>(DEFAULT_MODEL)
  const [downloaded, setDownloaded] = useState(false)
  const [output, setOutput] = useState('')
  const [metrics, setMetrics] = useState<InferenceMetrics | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    llmRef.current = new OnDeviceLLM()
    return () => {
      llmRef.current?.release()
    }
  }, [])

  function localFile(spec: ModelSpec): File {
    const name = spec.url.split('/').pop() as string
    return new File(Paths.document, 'models', name)
  }

  /** Ensure the selected GGUF is on device, downloading once if needed. */
  async function ensureModel(spec: ModelSpec = model): Promise<File> {
    setError(null)
    const file = localFile(spec)
    if (!file.exists) {
      setPhase('downloading')
      setDownloading(true)
      // expo-file-system v19: the destination directory must exist first.
      const modelsDir = new File(Paths.document, 'models')
      if (!modelsDir.exists) await modelsDir.create()
      await File.downloadFileAsync(spec.url, modelsDir)
      setDownloading(false)
      setDownloaded(true)
    }
    return file
  }

  async function load(spec: ModelSpec = model): Promise<boolean> {
    setPhase('loading')
    const file = await ensureModel(spec)
    const gpu = await llmRef.current!.load(file.uri, spec.contextSize)
    setMetrics((m) => ({ ...(m as InferenceMetrics), gpu }))
    setPhase('ready')
    return gpu
  }

  async function generate(prompt: string, system?: string): Promise<string> {
    if (!llmRef.current?.loaded) await load(model)
    setPhase('generating')
    setOutput('')
    const { text, metrics: m } = await llmRef.current!.generate(
      prompt,
      (_tok: string, partial: string) => setOutput(partial),
      { system, maxTokens: 256 },
    )
    setMetrics(m)
    setPhase('ready')
    return text
  }

  async function pickModel(spec: ModelSpec) {
    if (llmRef.current?.loaded) await llmRef.current.release()
    setModel(spec)
    setMetrics(null)
    setDownloaded(false)
    setPhase('idle')
  }

  return {
    phase,
    model,
    models: MODELS,
    downloaded,
    downloading,
    output,
    metrics,
    error,
    load,
    generate,
    pickModel,
    isOffline: phase !== 'downloading' && phase !== 'idle',
  }
}
