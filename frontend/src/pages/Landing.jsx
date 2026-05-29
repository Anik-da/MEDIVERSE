import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Zap, Stethoscope, Activity, Brain, Shield, ArrowRight, Sparkles,
  Heart, Cpu, ChevronDown
} from 'lucide-react'

const features = [
  {
    icon: Stethoscope,
    title: 'AI Diagnostics',
    desc: 'Advanced symptom analysis powered by neural networks for instant preliminary diagnosis.',
    color: '#00F0FF',
  },
  {
    icon: Activity,
    title: 'Patient Analytics',
    desc: 'Real-time health monitoring with predictive analytics and trend visualization.',
    color: '#A855F7',
  },
  {
    icon: Brain,
    title: 'Mental Wellness',
    desc: 'AI-driven emotional support companion with mood tracking and wellness guidance.',
    color: '#EC4899',
  },
  {
    icon: Shield,
    title: 'Emergency Response',
    desc: 'One-tap SOS system with live location sharing and nearest hospital routing.',
    color: '#00FF88',
  },
  {
    icon: Cpu,
    title: 'Voice Diagnosis',
    desc: 'Analyze cough patterns, breathing, and voice biomarkers for health insights.',
    color: '#FF6B35',
  },
  {
    icon: Heart,
    title: 'Smart Records',
    desc: 'OCR-powered medical report scanning with AI-generated summaries and risk alerts.',
    color: '#FF3366',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-cyber-black text-text-primary overflow-hidden">
      {/* Background effects */}
      <div className="cyber-grid" />

      {/* Floating orbs */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="fixed top-20 left-10 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="fixed bottom-20 right-10 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none"
      />

      {/* ─── HERO SECTION ────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Navbar */}
        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass-panel-strong"
          style={{ borderRadius: 0, borderTop: 'none' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <Zap size={20} className="text-cyber-black" />
            </div>
            <span className="font-heading text-sm font-bold tracking-wider gradient-text">
              MEDIVERSE AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-text-secondary hover:text-neon-blue transition-colors">Features</a>
            <a href="#about" className="text-sm text-text-secondary hover:text-neon-blue transition-colors">About</a>
            <button
              onClick={() => navigate('/auth')}
              className="btn-neon text-xs py-2 px-5"
            >
              Launch App
            </button>
          </div>
        </motion.nav>

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-blue/20 bg-neon-blue/5 mb-8"
          >
            <Sparkles size={14} className="text-neon-blue" />
            <span className="text-xs font-medium text-neon-blue tracking-wide">NEXT-GEN HEALTHCARE PLATFORM</span>
          </motion.div>

          <h1 className="font-heading text-5xl md:text-7xl font-black leading-tight mb-6">
            <span className="text-text-primary">The Future of</span>
            <br />
            <span className="gradient-text">AI-Powered</span>
            <br />
            <span className="neon-text-blue">Healthcare</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Revolutionizing patient care with neural diagnostics, real-time health monitoring,
            and intelligent emergency response — all powered by cutting-edge artificial intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/auth')}
              className="btn-neon-filled flex items-center gap-2 text-sm px-8 py-3.5"
            >
              Get Started <ArrowRight size={16} />
            </button>
            <button className="btn-neon flex items-center gap-2 text-sm px-8 py-3.5">
              Watch Demo <Sparkles size={16} />
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10"
        >
          <ChevronDown size={24} className="text-text-muted" />
        </motion.div>
      </section>

      {/* ─── FEATURES SECTION ────────────────────────────── */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Powered by <span className="gradient-text">Intelligence</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Six core modules working in harmony to deliver comprehensive AI-driven healthcare.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                  className="glass-panel p-6 group cursor-pointer relative overflow-hidden"
                >
                  {/* Glow */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${f.color}80, transparent)` }}
                  />
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${f.color}15` }}
                  >
                    <Icon size={24} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT / STATS SECTION ───────────────────────── */}
      <section id="about" className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { val: '99.2%', label: 'Accuracy' },
              { val: '50K+', label: 'Diagnoses' },
              { val: '<2s', label: 'Response' },
              { val: '24/7', label: 'Available' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6"
              >
                <p className="font-heading text-2xl font-bold gradient-text">{s.val}</p>
                <p className="text-xs text-text-secondary mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer className="border-t border-cyber-border py-8 px-6 text-center">
        <p className="text-xs text-text-muted">
          © 2026 MediVerse AI — Built with ❤️ for the future of healthcare.
        </p>
      </footer>
    </div>
  )
}
