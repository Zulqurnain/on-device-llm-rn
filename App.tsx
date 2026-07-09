import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { StyleSheet, Text, TextInput, View, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { useOnDeviceLLM } from './src/hooks/useOnDeviceLLM'

export default function App() {
  const {
    phase,
    model,
    models,
    downloading,
    output,
    metrics,
    load,
    generate,
    pickModel,
  } = useOnDeviceLLM()
  const [prompt, setPrompt] = useState('What runs fully on my phone with no internet?')

  const busy = phase === 'downloading' || phase === 'loading' || phase === 'generating'

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>On-Device LLM · React Native</Text>
      <Text style={styles.subtitle}>
        100% offline · zero cloud · llama.cpp via llama.rn
      </Text>

      <View style={styles.modelRow}>
        <Text style={styles.label}>Model:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {models.map((m) => (
            <Pressable
              key={m.name}
              style={[styles.chip, m.name === model.name && styles.chipActive]}
              onPress={() => pickModel(m)}
            >
              <Text style={[styles.chipText, m.name === model.name && styles.chipTextActive]}>
                {m.name.split(' (')[0]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <TextInput
        style={styles.input}
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Ask your private model…"
        placeholderTextColor="#888"
        multiline
      />

      <View style={styles.buttonRow}>
        {phase !== 'ready' && phase !== 'generating' ? (
          <Pressable style={styles.btn} disabled={busy} onPress={() => load()}>
            <Text style={styles.btnText}>
              {phase === 'downloading'
                ? 'Downloading model…'
                : phase === 'loading'
                  ? 'Loading model…'
                  : 'Load model'}
            </Text>
          </Pressable>
        ) : null}
        <Pressable style={[styles.btn, styles.btnPrimary]} disabled={busy} onPress={() => generate(prompt)}>
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Generate</Text>}
        </Pressable>
      </View>

      {phase === 'downloading' && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: downloading ? '60%' : '0%' }]} />
        </View>
      )}

      <View style={styles.metrics}>
        {metrics && (
          <Text style={styles.metricsText}>
            cold-start {metrics.loadMs} ms · first-token {metrics.firstTokenMs} ms ·{' '}
            {metrics.tokensPerSec.toFixed(1)} tok/s · {metrics.gpu ? 'GPU/NPU ✅' : 'CPU'}
          </Text>
        )}
      </View>

      <ScrollView style={styles.output} contentContainerStyle={styles.outputInner}>
        <Text style={styles.outputText}>{output || 'Output appears here — no data leaves the device.'}</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0e14', padding: 16, paddingTop: 48 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#7CFC9B', fontSize: 12, marginTop: 4, marginBottom: 16 },
  modelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { color: '#9aa', fontSize: 12, marginRight: 8 },
  chips: { flexGrow: 1 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#1a2030', borderRadius: 16, marginRight: 6 },
  chipActive: { backgroundColor: '#7CFC9B' },
  chipText: { color: '#cdd', fontSize: 11 },
  chipTextActive: { color: '#0b0e14', fontWeight: '700' },
  input: {
    backgroundColor: '#141a26', color: '#fff', borderRadius: 10, padding: 12,
    fontSize: 14, minHeight: 64, textAlignVertical: 'top', marginBottom: 12,
  },
  buttonRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  btn: {
    flex: 1, backgroundColor: '#222b3d', borderRadius: 10, paddingVertical: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: '#7CFC9B' },
  btnText: { color: '#fff', fontWeight: '700' },
  progressBar: { height: 6, backgroundColor: '#222b3d', borderRadius: 3, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: '#7CFC9B' },
  metrics: { marginBottom: 10 },
  metricsText: { color: '#8fb', fontSize: 11 },
  output: { flex: 1, backgroundColor: '#141a26', borderRadius: 10, marginTop: 4 },
  outputInner: { padding: 12 },
  outputText: { color: '#dde', fontSize: 14, lineHeight: 22 },
})
