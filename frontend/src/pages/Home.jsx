import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Stethoscope, AlertTriangle, MapPin, Pill, Brain, Activity,
  Mic, ScanLine, ArrowUpRight, TrendingUp, Users, Clock, HeartPulse,
  Sparkles, Shield, Zap
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

const quickActions = [
  { icon: Stethoscope, label: 'Symptom Checker', path: '/symptom-checker', color: '#00D4FF', desc: 'AI-powered symptom analysis & disease prediction' },
  { icon: AlertTriangle, label: 'Emergency SOS', path: '/emergency', color: '#EF4444', desc: 'One-tap emergency alert with live GPS tracking' },
  { icon: MapPin, label: 'Find Hospitals', path: '/hospitals', color: '#10B981', desc: 'Locate nearest hospitals with real-time availability' },
  { icon: Pill, label: 'Medicine Scanner', path: '/medicine-scanner', color: '#8B5CF6', desc: 'Scan & identify medicines with dosage info' },
  { icon: Brain, label: 'Mental Health', path: '/mental-health', color: '#EC4899', desc: 'AI wellness companion & mood tracking' },
  { icon: Activity, label: 'Health Dashboard', path: '/dashboard', color: '#00D4FF', desc: 'Comprehensive analytics & health insights' },
  { icon: Mic, label: 'Voice Diagnosis', path: '/voice-diagnosis', color: '#F59E0B', desc: 'Analyze voice patterns for health indicators' },
  { icon: ScanLine, label: 'OCR Scanner', path: '/ocr-scanner', color: '#8B5CF6', desc: 'Extract & summarize medical reports with AI' },
]

const activity = [
  { icon: Stethoscope, text: 'Symptom analysis completed', detail: 'Mild seasonal allergy — Low severity', time: '2h ago', color: '#00D4FF' },
  { icon: ScanLine, text: 'Blood report analyzed', detail: 'All values within normal range', time: '1d ago', color: '#8B5CF6' },
  { icon: Brain, text: 'Wellness session finished', detail: 'Stress level: Moderate — 3 exercises suggested', time: '2d ago', color: '#EC4899' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-text-primary">Good Morning, Anik 👋</h1>
        </div>
        <p className="text-text-secondary text-sm">Here's your health overview for today. Your AI companion is ready to assist.</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={HeartPulse} label="Health Score" value="92" change="+3%" accentColor="#00D4FF" delay={0} />
        <StatCard icon={TrendingUp} label="Checkups" value="24" change="+12%" accentColor="#8B5CF6" delay={0.05} />
        <StatCard icon={Users} label="AI Sessions" value="156" change="+8%" accentColor="#10B981" delay={0.1} />
        <StatCard icon={Clock} label="Avg Response" value="1.2s" change="-15%" accentColor="#EC4899" delay={0.15} />
      </div>

      {/* Featured alert banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 p-4 rounded-2xl border border-neon-blue/10 flex items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.04), rgba(139,92,246,0.04))' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center">
            <Shield size={20} className="text-neon-blue" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">All health metrics are looking good!</p>
            <p className="text-xs text-text-muted">Your AI health score improved by 3% this week.</p>
          </div>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-neon text-xs py-2 px-4 whitespace-nowrap">
          View Details
        </button>
      </motion.div>

      {/* Quick Actions */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Zap size={14} className="text-neon-blue" /> Quick Actions
          </h2>
          <span className="text-[11px] text-text-muted">{quickActions.length} modules available</span>
        </div>
      </div>

      <motion.div
        initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
      >
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <motion.div
              key={action.path}
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
            >
              <motion.button
                onClick={() => navigate(action.path)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left p-4 rounded-2xl border border-cyber-border/40 bg-cyber-dark/40 hover:border-opacity-60 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                {/* Subtle gradient on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${action.color}06, transparent 70%)` }} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${action.color}10`, border: `1px solid ${action.color}15` }}>
                      <Icon size={20} style={{ color: action.color }} />
                    </div>
                    <ArrowUpRight size={14} className="text-text-muted group-hover:text-text-secondary transition-colors" />
                  </div>
                  <h3 className="font-semibold text-[13px] text-text-primary mb-1">{action.label}</h3>
                  <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">{action.desc}</p>
                </div>
              </motion.button>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Recent Activity */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Sparkles size={14} className="text-neon-purple" /> Recent Activity
        </h2>
        <button className="text-[11px] text-neon-blue hover:underline cursor-pointer">View all</button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-1 mb-6"
      >
        {activity.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className={`flex items-center gap-4 p-3.5 rounded-xl hover:bg-white/[0.02] transition-colors ${i < activity.length - 1 ? 'border-b border-cyber-border/20' : ''}`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${item.color}08`, border: `1px solid ${item.color}12` }}>
                <Icon size={16} style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-text-primary">{item.text}</p>
                <p className="text-[11px] text-text-muted mt-0.5 truncate">{item.detail}</p>
              </div>
              <span className="text-[10px] text-text-muted whitespace-nowrap">{item.time}</span>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
