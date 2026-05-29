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
  UserPlus
} from 'lucide-react'

const featureCards = [
  {
    icon: Stethoscope,
    title: 'AI Diagnosis',
    desc: 'Instant, clinical-grade symptom analysis and disease probability matching based on Indian national health networks.',
    color: '#00F0FF', // Neon Blue
    glowClass: 'shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:border-[#00F0FF]/50'
  },
  {
    icon: MapPin,
    title: 'Hospital Finder',
    desc: 'Locate nearby critical care clinics, private hospitals, and government centers with accurate route ETAs.',
    color: '#00FF88', // Neon Emerald
    glowClass: 'shadow-[0_0_15px_rgba(0,255,136,0.15)] hover:border-[#00FF88]/50'
  },
  {
    icon: Pill,
    title: 'Medicine Scanner',
    desc: 'Scan medical packaging using OCR to decipher active pharmaceutical compounds, dosage guidelines, and safety alerts.',
    color: '#FF6B35', // Neon Orange
    glowClass: 'shadow-[0_0_15px_rgba(255,107,53,0.15)] hover:border-[#FF6B35]/50'
  },
  {
    icon: Brain,
    title: 'Mental Wellness',
    desc: 'Empathetic diagnostic wellness counselor offering real-time mindfulness exercises, stress analysis, and clinical logs.',
    color: '#FF007F', // Neon Pink
    glowClass: 'shadow-[0_0_15px_rgba(255,0,127,0.15)] hover:border-[#FF007F]/50'
  },
]

const statistics = [
  { val: '1,20,500+', label: 'Patients Helped', color: '#00F0FF' },
  { val: '4,500+', label: 'Hospitals Connected', color: '#00FF88' },
  { val: '85,000+', label: 'Reports Analyzed', color: '#FF6B35' },
  { val: '3,10,000+', label: 'Predictions Generated', color: '#FF007F' },
]

const steps = [
  { num: '01', title: 'Upload Symptoms', desc: 'Enter symptoms manually or via direct voice biomarkers.' },
  { num: '02', title: 'AI Analysis', desc: 'Our deep neural models check matches and evaluate risk percentages.' },
  { num: '03', title: 'Get Guidance', desc: 'Receive instant precautions, generic medicine info, and summaries.' },
  { num: '04', title: 'Find Nearby Care', desc: 'Locate local clinics and navigate with full ambulance coordination.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 overflow-x-hidden relative font-body">
      {/* Sleek cyber grid mesh background */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0 bg-[radial-gradient(circle_at_50%_120%,rgba(15,76,129,0.15),transparent_60%)]" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-15" style={{
        backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* ─── STATIC PROFESSIONAL NAVBAR ─────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-8 bg-[#090F1C]/80 backdrop-blur-md border-b border-slate-800"
      >
        <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="MediVerse Logo" className="w-10 h-10 object-contain rounded-none border border-slate-700/50" />
          <span className="font-heading font-black text-xl text-white tracking-widest uppercase">
            MEDIVERSE<span className="text-[#00F0FF]">.AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2.5 bg-transparent border-2 border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10 text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer rounded-none"
          >
            Sign In Portal
          </button>
        </div>
      </motion.nav>

      {/* ─── SECTION 1: HERO SECTION ────────────────────────── */}
      <section className="min-h-screen pt-28 flex items-center justify-center px-6 lg:px-16 max-w-[1400px] mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-[#00F0FF]/5 border border-[#00F0FF]/20">
              <Sparkles size={13} className="text-[#00F0FF]" />
              <span className="text-[10px] font-black text-[#00F0FF] tracking-widest uppercase">
                National Health Intelligence Initiative
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-heading uppercase tracking-wide">
              AI Powered <br />
              Healthcare <span className="text-[#00F0FF] block mt-1">For Every Indian</span>
            </h1>

            <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-xl">
              Bringing advanced clinical diagnostics, immediate emergency response routing, 
              OCR report simplification, and digital mental support to every citizen — built 
              securely to bridge medical accessibility gaps across India.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/auth')}
                className="px-8 py-3.5 bg-gradient-to-r from-[#00F0FF] to-[#A855F7] text-[#070B14] hover:brightness-110 font-black text-sm uppercase tracking-widest transition-all duration-200 flex items-center gap-2 cursor-pointer rounded-none border-none shadow-[0_0_20px_rgba(0,240,255,0.2)]"
              >
                Get Started <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/emergency')}
                className="px-8 py-3.5 rounded-none border-2 border-[#FF3B30] bg-[#FF3B30]/5 hover:bg-[#FF3B30] text-[#FF3B30] hover:text-white transition-all text-sm font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer"
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
              className="w-full max-w-[400px] h-[360px] rounded-none bg-[#090F1C] border border-[#00F0FF]/30 p-8 flex flex-col justify-between shadow-[0_0_30px_rgba(0,240,255,0.1)] relative overflow-hidden"
            >
              {/* Dynamic pulsing nodes representing biological networks */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#A855F7]/10 blur-3xl rounded-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00F0FF]/10 blur-3xl rounded-none" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="text-[#A855F7] animate-pulse" size={18} />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live Neural Diagnosis</span>
                </div>
                <span className="text-[9px] bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] px-2 py-0.5 rounded-none font-black uppercase tracking-wider">Active</span>
              </div>

              {/* Heart rate graph indicator */}
              <div className="flex-1 flex items-center justify-center py-6">
                <svg viewBox="0 0 200 60" className="w-full h-24 stroke-[#00F0FF] fill-none stroke-[2.5] stroke-linecap-round">
                  <path d="M 0,30 L 30,30 L 40,10 L 50,50 L 60,30 L 100,30 L 110,5 L 120,55 L 130,30 L 200,30" />
                </svg>
              </div>

              <div className="bg-[#070B14] p-3.5 rounded-none border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] border border-[#00F0FF]/20">
                  <HeartPulse size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Diagnostic Heart Score</p>
                  <p className="text-xs font-black text-[#00F0FF] uppercase mt-0.5">98.4% Normal Rhythms</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: FEATURE CARDS GRID ───────────────────── */}
      <section className="py-24 bg-[#090F1C] border-y border-slate-800 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 w-full text-center">
          <div className="max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black font-heading text-white uppercase tracking-wider">
              Innovative Healthcare Modules
            </h2>
            <div className="h-1 w-20 bg-[#00F0FF] mx-auto" />
            <p className="text-slate-400 text-xs md:text-sm">
              Explore our core segments built strictly to satisfy national medical demands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={i}
                  className={`bg-[#070B14]/60 p-8 border border-slate-800 rounded-none text-left group hover:scale-[1.03] hover:bg-[#070B14]/90 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${f.glowClass}`}
                >
                  <div>
                    <div
                      className="w-12 h-12 rounded-none flex items-center justify-center mb-6 border"
                      style={{ backgroundColor: `${f.color}10`, borderColor: `${f.color}25` }}
                    >
                      <Icon size={20} style={{ color: f.color }} />
                    </div>
                    <h3 className="font-heading text-base font-black text-white uppercase tracking-wide mb-3">{f.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{f.desc}</p>
                  </div>
                  
                  {/* Action Link decoration */}
                  <div className="mt-6 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: f.color }}>
                    Launch Module <ArrowRight size={12} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: STATISTICS ──────────────────────────── */}
      <section className="py-20 bg-[#070B14] relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {statistics.map((s, i) => (
              <div key={i} className="bg-[#090F1C] p-6 border border-slate-800 rounded-none hover:border-slate-700 transition-colors">
                <p className="text-3xl font-black font-heading tracking-tight" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: HOW IT WORKS ────────────────────────── */}
      <section className="py-24 bg-[#090F1C] border-t border-slate-800 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 w-full text-center">
          <div className="max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black font-heading text-white uppercase tracking-wider">
              Empowering Journey Model
            </h2>
            <div className="h-1 w-20 bg-[#00F0FF] mx-auto" />
            <p className="text-slate-400 text-xs md:text-sm">
              Four streamlined checkpoints leading from symptom awareness to hospital delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 p-4 hover:bg-[#070B14]/40 transition-colors border border-transparent hover:border-slate-800 rounded-none group">
                <div className="w-12 h-12 rounded-none bg-[#070B14] border-2 border-[#00F0FF] text-[#00F0FF] flex items-center justify-center font-black text-sm tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.1)] group-hover:bg-[#00F0FF] group-hover:text-[#070B14] transition-all duration-200">
                  {s.num}
                </div>
                <h3 className="text-sm font-black font-heading text-white uppercase tracking-wider">{s.title}</h3>
                <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-10 bg-[#070B14] text-center relative z-10">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          © 2026 MediVerse AI — Made with ❤️ in India. National Healthcare System Certified.
        </p>
      </footer>
    </div>
  )
}
