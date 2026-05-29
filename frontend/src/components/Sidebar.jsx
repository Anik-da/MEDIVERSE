import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Stethoscope,
  AlertTriangle,
  MapPin,
  Pill,
  Brain,
  Activity,
  Mic,
  ScanLine,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/home', color: '#00D4FF' },
  { icon: Stethoscope, label: 'Symptom Checker', path: '/symptom-checker', color: '#00D4FF' },
  { icon: AlertTriangle, label: 'Emergency', path: '/emergency', color: '#EF4444' },
  { icon: MapPin, label: 'Find Hospitals', path: '/hospitals', color: '#10B981' },
  { icon: Pill, label: 'Medicine Scanner', path: '/medicine-scanner', color: '#8B5CF6' },
  { icon: Brain, label: 'Mental Health', path: '/mental-health', color: '#EC4899' },
  { icon: Activity, label: 'Dashboard', path: '/dashboard', color: '#00D4FF' },
  { icon: Mic, label: 'Voice Diagnosis', path: '/voice-diagnosis', color: '#F59E0B' },
  { icon: ScanLine, label: 'OCR Scanner', path: '/ocr-scanner', color: '#8B5CF6' },
  { icon: User, label: 'Profile', path: '/profile', color: '#00D4FF' },
]

export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 250 : 68 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 h-screen z-40 flex flex-col border-r border-cyber-border/50"
      style={{
        background: 'linear-gradient(180deg, rgba(10,10,24,0.97) 0%, rgba(6,6,15,0.99) 100%)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-cyber-border/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center flex-shrink-0 shadow-lg shadow-neon-blue/10">
          <Zap size={18} className="text-white" />
        </div>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col"
          >
            <span className="font-heading text-[11px] font-bold tracking-widest gradient-text leading-none">
              MEDIVERSE
            </span>
            <span className="text-[9px] text-text-muted tracking-wider mt-0.5">AI HEALTHCARE</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {isOpen && (
          <div className="px-2 mb-2">
            <span className="text-[9px] font-semibold text-text-muted uppercase tracking-widest">Navigation</span>
          </div>
        )}
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.97 }}
              className={`
                w-full flex items-center gap-3 rounded-xl transition-all duration-200 cursor-pointer relative
                ${isOpen ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'}
                ${isActive
                  ? 'text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'
                }
              `}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}12, ${item.color}06)`,
                    border: `1px solid ${item.color}20`,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Active left bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebarBar"
                  className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-full"
                  style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3">
                <Icon size={18} className="flex-shrink-0" style={isActive ? { color: item.color } : {}} />
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[13px] font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </div>
            </motion.button>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-2 space-y-2">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-1 p-3 rounded-xl bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 border border-neon-blue/10"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={12} className="text-neon-blue" />
              <span className="text-[10px] font-semibold text-neon-blue">AI Status</span>
            </div>
            <p className="text-[10px] text-text-muted leading-relaxed">All systems operational</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-neon" />
              <span className="text-[9px] text-neon-green">Online</span>
            </div>
          </motion.div>
        )}

        <button
          onClick={async () => {
            await logout()
            navigate('/auth')
          }}
          className="w-full flex items-center gap-3 rounded-xl hover:bg-neon-red/10 text-text-secondary hover:text-neon-red transition-all cursor-pointer px-3 py-2.5"
        >
          <div className="relative z-10 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out flex-shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            {isOpen && (
              <span className="text-[13px] font-medium whitespace-nowrap">Log Out</span>
            )}
          </div>
        </button>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center h-10 rounded-xl text-text-muted hover:text-neon-blue hover:bg-white/[0.03] transition-all cursor-pointer"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </motion.aside>
  )
}
