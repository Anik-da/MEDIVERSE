import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Send, Smile, Frown, Meh, Heart, Sparkles, Sun, Moon, Coffee } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import GlowCard from '../components/GlowCard'
import { useAuth } from '../context/AuthContext'
import { saveChatMessage } from '../services/firebaseService'
import { queryHuggingFaceDirect } from '../services/huggingfaceService'

const moods = [
  { icon: Smile, label: 'Happy', color: '#00FF88' },
  { icon: Meh, label: 'Neutral', color: '#00F0FF' },
  { icon: Frown, label: 'Stressed', color: '#FF6B35' },
  { icon: Heart, label: 'Anxious', color: '#EC4899' },
]

const tips = [
  { icon: Sun, text: 'Try 10 minutes of morning sunlight for better mood regulation.', color: '#FF6B35' },
  { icon: Coffee, text: 'Limit caffeine after 2 PM for improved sleep quality.', color: '#A855F7' },
  { icon: Moon, text: 'Practice 4-7-8 breathing before sleep for relaxation.', color: '#00F0FF' },
]

const initialMessages = [
  { role: 'ai', text: "Hello! I'm your MediVerse mental wellness companion. How are you feeling today? 💙", emotion: 'calm' },
]

export default function MentalHealthChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const chatEndRef = useRef(null)

  const { currentUser } = useAuth()

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const textStr = input.trim()
    const userMsg = { role: 'user', text: textStr }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    try {
      const idToken = await currentUser?.getIdToken ? await currentUser.getIdToken() : ""
      
      const response = await fetch('http://localhost:8000/mental-health-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ 
          message: textStr,
          mood: selectedMood || 'neutral'
        })
      })

      if (!response.ok) throw new Error('API server returned error status.')
      const data = await response.json()
      
      if (data.status === 'success') {
        const aiMsg = { role: 'ai', text: data.response, emotion: 'supportive' }
        setMessages(prev => [...prev, aiMsg])
        await saveChatMessage(currentUser.uid, textStr, selectedMood || 'neutral', data.response)
      } else {
        throw new Error('AI analysis failed.')
      }
    } catch (err) {
      console.warn("FastAPI offline, calling direct HuggingFace model...", err)
      try {
        const prompt = `You are a supportive, calm mental health wellness companion. The user mood is ${selectedMood || 'neutral'}. The user says: '${textStr}'. Provide an empathetic response in 2-3 sentences.`
        const hfResponse = await queryHuggingFaceDirect(prompt, "ruslanmv/Medical-Llama3-8B")
        
        if (hfResponse) {
          const parsedRes = hfResponse.includes("[/INST]") ? hfResponse.split("[/INST]").pop().trim() : hfResponse
          const aiMsg = { role: 'ai', text: parsedRes, emotion: 'supportive' }
          setMessages(prev => [...prev, aiMsg])
          await saveChatMessage(currentUser.uid, textStr, selectedMood || 'neutral', parsedRes)
          return
        }
      } catch (hfErr) {
        console.error("Direct HF fallback failed:", hfErr)
      }

      // Hard fallback
      const aiResponses = [
        "I understand how you're feeling. It's completely valid. Would you like to try a guided breathing exercise?",
        "That sounds challenging. Remember, it's okay to take things one step at a time. What's been on your mind the most?",
        "Thank you for sharing. I'm here for you. Have you tried journaling your thoughts? It can be very therapeutic."
      ]
      const chosenFallback = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      const aiMsg = { role: 'ai', text: chosenFallback, emotion: 'supportive' }
      setMessages(prev => [...prev, aiMsg])
      await saveChatMessage(currentUser.uid, textStr, selectedMood || 'neutral', chosenFallback)
    } finally {
      setTyping(false)
    }
  }

  return (
    <div>
      <PageHeader icon={Brain} title="Mental Health Companion" subtitle="AI-powered emotional support and wellness guidance." accentColor="neon-pink" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Mood & Tips */}
        <div className="lg:col-span-1 space-y-4">
          <GlowCard hover={false} glowColor="neon-pink">
            <h3 className="font-heading text-xs font-semibold mb-3 text-text-primary">Today's Mood</h3>
            <div className="grid grid-cols-2 gap-2">
              {moods.map((m) => {
                const Icon = m.icon
                const active = selectedMood === m.label
                return (
                  <motion.button key={m.label} whileTap={{ scale: 0.9 }} onClick={() => setSelectedMood(m.label)}
                    className={`p-3 rounded-none border text-center transition-all cursor-pointer ${active ? 'border-opacity-50' : 'border-cyber-border hover:border-opacity-30'}`}
                    style={active ? { borderColor: m.color, backgroundColor: `${m.color}10` } : {}}>
                    <Icon size={20} className="mx-auto mb-1" style={{ color: m.color }} />
                    <span className="text-xs text-text-secondary">{m.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </GlowCard>

          <GlowCard hover={false}>
            <h3 className="font-heading text-xs font-semibold mb-3 text-text-primary flex items-center gap-1.5">
              <Sparkles size={14} className="text-neon-purple" /> Wellness Tips
            </h3>
            <div className="space-y-3">
              {tips.map((t, i) => {
                const Icon = t.icon
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-2.5 p-2 rounded-none hover:bg-white/[0.02] transition-colors">
                    <Icon size={14} className="flex-shrink-0 mt-0.5" style={{ color: t.color }} />
                    <p className="text-xs text-text-secondary leading-relaxed">{t.text}</p>
                  </motion.div>
                )
              })}
            </div>
          </GlowCard>

          {/* Weekly mood chart placeholder */}
          <GlowCard hover={false}>
            <h3 className="font-heading text-xs font-semibold mb-3 text-text-primary">Mood This Week</h3>
            <div className="flex items-end justify-between gap-1 h-20">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => {
                const heights = [60, 75, 50, 80, 65, 90, 70]
                return (
                  <div key={d} className="flex flex-col items-center gap-1 flex-1">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${heights[i]}%` }} transition={{ delay: i * 0.08, duration: 0.5 }}
                      className="w-full rounded-none bg-gradient-to-t from-neon-pink/40 to-neon-purple/40 min-h-[4px]" />
                    <span className="text-[9px] text-text-muted">{d}</span>
                  </div>
                )
              })}
            </div>
          </GlowCard>
        </div>

        {/* Chat area */}
        <div className="lg:col-span-3">
          <GlowCard hover={false} glowColor="neon-pink" className="flex flex-col" style={{ minHeight: '520px' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[420px] pr-2">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-none text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/15 text-text-primary'
                      : 'bg-cyber-dark border border-cyber-border text-text-secondary'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-cyber-dark border border-cyber-border px-4 py-3 rounded-none flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 rounded-none bg-neon-pink/60" />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="flex gap-2 pt-3 border-t border-cyber-border">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Share how you're feeling..."
                className="flex-1 px-4 py-2.5 rounded-none bg-cyber-dark border border-cyber-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-pink/40 transition-all" />
              <motion.button whileTap={{ scale: 0.9 }} onClick={sendMessage}
                disabled={!input.trim()}
                className="p-2.5 rounded-none bg-gradient-to-r from-neon-pink to-neon-purple text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <Send size={18} />
              </motion.button>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  )
}
