import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Play, Square, RotateCcw, Sparkles, Volume2, Activity } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import GlowCard from '../components/GlowCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { uploadVoiceRecording, saveVoiceDiagnosis } from '../services/firebaseService'

const mockAnalysis = {
  transcript: "I've been having a persistent dry cough for the past three days, especially at night. Sometimes I feel short of breath.",
  patterns: [
    { label: 'Cough Pattern', value: 'Dry, persistent', risk: 'Medium', color: '#FF6B35' },
    { label: 'Breathing', value: 'Slightly labored', risk: 'Low', color: '#00FF88' },
    { label: 'Stress Level', value: 'Moderate', risk: 'Medium', color: '#A855F7' },
    { label: 'Voice Clarity', value: 'Normal', risk: 'Low', color: '#00F0FF' },
  ],
  suggestions: [
    'Consider a pulmonary function test if cough persists beyond 7 days',
    'Stay hydrated and use a humidifier at night',
    'Avoid irritants like smoke and strong odors',
    'Practice diaphragmatic breathing exercises',
  ],
}

export default function VoiceDiagnosis() {
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [waveData, setWaveData] = useState(Array(40).fill(4))
  const [audioBlob, setAudioBlob] = useState(null)
  
  const timerRef = useRef(null)
  const waveRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const { currentUser } = useAuth()

  const startRecording = async () => {
    setRecording(true); setRecorded(false); setResult(null); setElapsed(0)
    audioChunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
      }
      mediaRecorderRef.current.start()
    } catch (err) {
      console.warn("Audio hardware capture failed:", err)
    }

    timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000)
    waveRef.current = setInterval(() => {
      setWaveData(Array(40).fill(0).map(() => Math.random() * 28 + 4))
    }, 100)
  }

  const stopRecording = () => {
    setRecording(false); setRecorded(true)
    clearInterval(timerRef.current); clearInterval(waveRef.current)
    setWaveData(Array(40).fill(4))

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const analyze = async () => {
    setAnalyzing(true)
    
    try {
      // 1. Upload audio to Firebase Storage
      let audioURL = ''
      if (audioBlob) {
        audioURL = await uploadVoiceRecording(currentUser.uid, audioBlob)
      } else {
        // Fallback dummy blob for simulation if microphone was disabled
        const dummyBlob = new Blob(['dummy audio content'], { type: 'audio/webm' })
        audioURL = await uploadVoiceRecording(currentUser.uid, dummyBlob)
      }

      // 2. Query voice diagnosis FastAPI endpoint
      const idToken = await currentUser.getIdToken()
      const response = await fetch('http://localhost:8000/voice-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ audio_url: audioURL })
      })

      let finalAnalysis = mockAnalysis
      if (response.ok) {
        const data = await response.json()
        if (data.status === 'success') {
          finalAnalysis = data.analysis
        }
      }

      setResult(finalAnalysis)
      // 3. Save to Firestore
      await saveVoiceDiagnosis(currentUser.uid, {
        audioUrl: audioURL,
        ...finalAnalysis
      })
    } catch (err) {
      console.error(err)
      setResult(mockAnalysis)
      await saveVoiceDiagnosis(currentUser.uid, {
        audioUrl: '',
        ...mockAnalysis
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const reset = () => { setRecording(false); setRecorded(false); setResult(null); setElapsed(0); setAudioBlob(null) }

  useEffect(() => () => { clearInterval(timerRef.current); clearInterval(waveRef.current) }, [])

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div>
      <PageHeader icon={Mic} title="Voice Diagnosis" subtitle="Record your voice for AI-powered health analysis." accentColor="neon-orange" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recording panel */}
        <div className="space-y-4">
          <GlowCard hover={false} glowColor="neon-orange">
            <div className="flex flex-col items-center py-6">
              {/* Waveform */}
              <div className="flex items-center gap-[3px] h-16 mb-6 w-full max-w-xs justify-center">
                {waveData.map((h, i) => (
                  <motion.div key={i} animate={{ height: h }} transition={{ duration: 0.1 }}
                    className="w-1.5 rounded-full"
                    style={{
                      background: recording
                        ? `linear-gradient(to top, #FF6B35, #EC4899)`
                        : 'rgba(255,255,255,0.1)',
                      boxShadow: recording ? '0 0 4px rgba(255,107,53,0.3)' : 'none',
                    }} />
                ))}
              </div>

              {/* Timer */}
              <p className="font-heading text-3xl font-bold text-text-primary mb-6">{formatTime(elapsed)}</p>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {!recording && !recorded && (
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-orange to-neon-pink flex items-center justify-center cursor-pointer"
                    style={{ boxShadow: '0 0 30px rgba(255,107,53,0.3)' }}>
                    <Mic size={28} className="text-white" />
                  </motion.button>
                )}
                {recording && (
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-neon-red/20 border-2 border-neon-red flex items-center justify-center cursor-pointer animate-pulse-neon">
                    <Square size={24} className="text-neon-red" />
                  </motion.button>
                )}
                {recorded && !analyzing && !result && (
                  <>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={reset}
                      className="w-12 h-12 rounded-full border border-cyber-border flex items-center justify-center cursor-pointer text-text-secondary hover:text-text-primary transition-colors">
                      <RotateCcw size={20} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={analyze}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-orange to-neon-pink text-white font-heading text-xs font-semibold tracking-wider uppercase flex items-center gap-2 cursor-pointer">
                      <Sparkles size={16} /> Analyze Voice
                    </motion.button>
                  </>
                )}
              </div>

              <p className="text-xs text-text-muted mt-4">
                {recording ? 'Recording... Speak clearly' : recorded ? 'Recording complete!' : 'Tap to start recording'}
              </p>
            </div>
          </GlowCard>

          {/* Tips */}
          <GlowCard hover={false}>
            <h3 className="font-heading text-sm font-semibold mb-3 text-text-primary flex items-center gap-2">
              <Volume2 size={16} className="text-neon-orange" /> Recording Tips
            </h3>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex items-start gap-2">• Speak in a quiet environment</li>
              <li className="flex items-start gap-2">• Describe symptoms clearly</li>
              <li className="flex items-start gap-2">• Include coughing if relevant</li>
              <li className="flex items-start gap-2">• Record for at least 15 seconds</li>
            </ul>
          </GlowCard>
        </div>

        {/* Results */}
        <div>
          {analyzing && <LoadingSpinner text="Analyzing voice patterns..." />}

          {!analyzing && !result && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Activity size={48} className="text-text-muted opacity-30 mb-4" />
              <p className="text-sm text-text-secondary">Record your voice to get AI analysis.</p>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <GlowCard hover={false} delay={0}>
                  <h3 className="font-heading text-sm font-semibold mb-2 text-text-primary">📝 Transcript</h3>
                  <p className="text-sm text-text-secondary italic leading-relaxed">"{result.transcript}"</p>
                </GlowCard>

                <GlowCard hover={false} delay={0.1}>
                  <h3 className="font-heading text-sm font-semibold mb-3 text-text-primary">🔍 Analysis</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {result.patterns.map((p, i) => (
                      <div key={i} className="p-3 rounded-xl bg-cyber-dark border border-cyber-border">
                        <p className="text-xs text-text-muted mb-1">{p.label}</p>
                        <p className="text-sm font-medium text-text-primary">{p.value}</p>
                        <span className="text-xs mt-1 inline-block px-2 py-0.5 rounded" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                          {p.risk} Risk
                        </span>
                      </div>
                    ))}
                  </div>
                </GlowCard>

                <GlowCard hover={false} delay={0.2}>
                  <h3 className="font-heading text-sm font-semibold mb-3 text-text-primary flex items-center gap-2">
                    <Sparkles size={14} className="text-neon-blue" /> AI Suggestions
                  </h3>
                  <div className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <span className="w-5 h-5 rounded-md bg-neon-blue/10 text-neon-blue flex items-center justify-center flex-shrink-0 text-[10px] font-bold">{i + 1}</span>
                        {s}
                      </div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
