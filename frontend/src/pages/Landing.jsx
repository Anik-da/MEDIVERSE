import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Stethoscope,
  MapPin,
  Pill,
  Brain,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  HeartPulse,
  Activity,
  FileText,
  UserPlus
} from 'lucide-react'

const featureCards = [
  {
    icon: Stethoscope,
    title: 'AI Diagnosis',
    desc: 'Instant, clinical-grade symptom analysis and disease probability matching based on Indian national health networks.',
    color: '#0F4C81',
  },
  {
    icon: MapPin,
    title: 'Hospital Finder',
    desc: 'Locate nearby critical care clinics, private hospitals, and government centers with accurate route ETAs.',
    color: '#14B8A6',
  },
  {
    icon: Pill,
    title: 'Medicine Scanner',
    desc: 'Scan medical packaging using OCR to immediately decipher local chemical compounds, dosage guidelines, and safety alerts.',
    color: '#FF9933',
  },
  {
    icon: Brain,
    title: 'Mental Wellness',
    desc: 'Empathetic diagnostic wellness counselor offering real-time mindfulness exercises, stress analysis, and clinical logs.',
    color: '#14B8A6',
  },
]

const statistics = [
  { val: '1,20,500+', label: 'Patients Helped' },
  { val: '4,500+', label: 'Hospitals Connected' },
  { val: '85,000+', label: 'Reports Analyzed' },
  { val: '3,10,000+', label: 'Predictions Generated' },
]

const steps = [
  { num: 'Step 1', title: 'Upload Symptoms', desc: 'Enter symptoms manually or via direct voice biomarkers.' },
  { num: 'Step 2', title: 'AI Analysis', desc: 'Our deep neural models check matches and evaluate risk percentages.' },
  { num: 'Step 3', title: 'Get Guidance', desc: 'Receive instant precautions, generic medicine info, and summaries.' },
  { num: 'Step 4', title: 'Find Nearby Care', desc: 'Locate local clinics and navigate with full ambulance coordination.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-cyber-black text-text-primary overflow-x-hidden relative font-body">
      {/* Mesh grid background */}
      <div className="cyber-grid" />

      {/* ─── STATIC PROFESSIONAL NAVBAR ─────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-8 bg-white border-b border-cyber-border"
      >
        <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="MediVerse Logo" className="w-10 h-10 object-contain rounded-xl" />
          <span className="font-heading font-extrabold text-lg text-neon-blue tracking-wide">
            MEDIVERSE AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="btn-neon text-xs font-semibold px-6 py-2.5"
          >
            Sign In Portal
          </button>
        </div>
      </motion.nav>

      {/* ─── SECTION 1: HERO SECTION ────────────────────────── */}
      <section className="min-h-screen pt-28 flex items-center justify-center px-6 lg:px-16 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-blue/5 border border-neon-blue/15">
              <Sparkles size={13} className="text-neon-blue" />
              <span className="text-[10px] font-bold text-neon-blue tracking-widest uppercase">
                National Health Intelligence Initiative
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary leading-tight font-heading">
              AI Powered Healthcare <br />
              <span className="text-neon-blue">For Every Indian</span>
            </h1>

            <p className="text-base text-text-secondary leading-relaxed max-w-xl">
              Bringing advanced clinical diagnostics, immediate emergency response routing, 
              OCR report simplification, and digital mental support to every citizen — built 
              securely to bridge medical accessibility gaps across India.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/auth')}
                className="btn-neon-filled flex items-center gap-2 text-sm px-8 py-3.5"
              >
                Get Started <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/emergency')}
                className="px-8 py-3.5 rounded-xl border border-neon-red bg-neon-red/5 hover:bg-neon-red text-neon-red hover:text-white transition-all text-sm font-bold flex items-center gap-2 cursor-pointer"
              >
                Emergency Help <ShieldAlert size={16} />
              </button>
            </div>
          </div>

          {/* Right Hero Illustration */}
          <div className="lg:col-span-5 flex justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-[400px] h-[360px] rounded-3xl bg-white border border-cyber-border p-8 flex flex-col justify-between shadow-xl relative overflow-hidden"
            >
              {/* Dynamic pulsing nodes representing biological networks */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/5 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-blue/5 rounded-full blur-2xl" />

              <div className="flex items-center justify-between border-b border-cyber-border pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="text-neon-purple animate-pulse" size={18} />
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Live Neural Diagnosis</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Stable</span>
              </div>

              {/* Heart rate graph indicator */}
              <div className="flex-1 flex items-center justify-center py-6">
                <svg viewBox="0 0 200 60" className="w-full h-24 stroke-neon-blue fill-none stroke-[2.5] stroke-linecap-round">
                  <path d="M 0,30 L 30,30 L 40,10 L 50,50 L 60,30 L 100,30 L 110,5 L 120,55 L 130,30 L 200,30" />
                </svg>
              </div>

              <div className="bg-cyber-black p-3.5 rounded-2xl border border-cyber-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                  <HeartPulse size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-text-secondary leading-none">Diagnostic Heart Score</p>
                  <p className="text-xs font-extrabold text-neon-blue mt-1">98.4% Normal Rhythms</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: FEATURE CARDS GRID ───────────────────── */}
      <section className="py-24 bg-white border-y border-cyber-border">
        <div className="max-w-[1400px] mx-auto px-6 w-full text-center">
          <div className="max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading text-text-primary">
              Innovative Healthcare Modules
            </h2>
            <p className="text-text-secondary text-sm mt-3">
              Explore our core segments built strictly to satisfy national medical demands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={i}
                  className="glass-panel p-6 border border-cyber-border text-left group hover:scale-[1.03] transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${f.color}08`, border: `1px solid ${f.color}20` }}
                  >
                    <Icon size={22} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-heading text-base font-bold text-text-primary mb-2.5">{f.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: STATISTICS ──────────────────────────── */}
      <section className="py-20 bg-cyber-black">
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {statistics.map((s, i) => (
              <div key={i} className="glass-panel p-6 border border-cyber-border bg-white">
                <p className="text-3xl font-black font-heading text-neon-blue">{s.val}</p>
                <p className="text-xs text-text-secondary mt-2 font-semibold uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: HOW IT WORKS ────────────────────────── */}
      <section className="py-24 bg-white border-t border-cyber-border">
        <div className="max-w-[1400px] mx-auto px-6 w-full text-center">
          <div className="max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading text-text-primary">
              Empowering Journey Model
            </h2>
            <p className="text-text-secondary text-sm mt-3">
              Four streamlined checkpoints leading from symptom awareness to hospital delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-neon-blue text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-neon-blue/15">
                  {s.num.split(' ')[1]}
                </div>
                <h3 className="text-base font-bold font-heading text-text-primary">{s.title}</h3>
                <p className="text-xs text-text-secondary max-w-[240px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="border-t border-cyber-border py-10 bg-white text-center">
        <p className="text-xs text-text-muted">
          © 2026 MediVerse AI — Made with ❤️ in India. National Healthcare System Certified.
        </p>
      </footer>
    </div>
  )
}
