import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Home,
  Stethoscope,
  ShieldAlert,
  MapPin,
  Pill,
  Brain,
  Mic,
  FileText,
  TrendingUp,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
} from 'lucide-react'

// Professional Menu Items Order strictly as specified
const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/home', color: '#0F4C81' },
  { icon: Stethoscope, label: 'Symptom Checker', path: '/symptom-checker', color: '#0F4C81' },
  { icon: ShieldAlert, label: 'Emergency SOS', path: '/emergency', color: '#EF4444' },
  { icon: MapPin, label: 'Hospital Finder', path: '/hospitals', color: '#14B8A6' },
  { icon: Pill, label: 'Medicine Scanner', path: '/medicine-scanner', color: '#FF9933' },
  { icon: Brain, label: 'Mental Health', path: '/mental-health', color: '#14B8A6' },
  { icon: Mic, label: 'Voice Diagnosis', path: '/voice-diagnosis', color: '#FF9933' },
  { icon: FileText, label: 'Report Scanner', path: '/ocr-scanner', color: '#0F4C81' },
  { icon: TrendingUp, label: 'Health Analytics', path: '/dashboard', color: '#0F4C81' },
  { icon: User, label: 'Profile', path: '/profile', color: '#14B8A6' },
  { icon: Settings, label: 'Settings', path: '/profile#settings', color: '#475569' },
]

export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 76 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 h-screen z-40 flex flex-col border-r border-cyber-border bg-white"
    >
      {/* Brand Header inside Sidebar */}
      <div className="flex items-center gap-3 px-4 h-20 border-b border-cyber-border">
        <img src="/logo.png" alt="MediVerse Logo" className="w-10 h-10 object-contain rounded-xl flex-shrink-0" />
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col"
          >
            <span className="font-heading text-[13px] font-extrabold text-neon-blue tracking-wider leading-none">
              MEDIVERSE
            </span>
            <span className="text-[10px] text-text-secondary tracking-widest mt-1 font-semibold">NATIONAL CARE</span>
          </motion.div>
        )}
      </div>

      {/* Navigation list */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center gap-3 rounded-xl transition-all duration-200 cursor-pointer relative
                ${isOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'}
                ${isActive
                  ? 'text-white font-bold bg-cyber-hover'
                  : 'text-text-secondary hover:text-neon-blue hover:bg-cyber-hover'
                }
              `}
            >
              {/* Active styling background */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: item.color,
                    boxShadow: `0 4px 12px rgba(15, 76, 129, 0.15)`,
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3">
                <Icon size={18} className="flex-shrink-0" style={isActive ? { color: '#ffffff' } : { color: item.color }} />
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

      {/* Footer / Logout segment */}
      <div className="px-3 pb-3 space-y-2">
        <button
          onClick={async () => {
            await logout()
            navigate('/auth')
          }}
          className="w-full flex items-center gap-3 rounded-xl hover:bg-red-50 text-text-secondary hover:text-neon-red transition-all cursor-pointer px-4 py-3"
        >
          <div className="relative z-10 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out flex-shrink-0 text-neon-red"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            {isOpen && (
              <span className="text-[13px] font-semibold whitespace-nowrap text-neon-red">Log Out</span>
            )}
          </div>
        </button>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center h-10 rounded-xl text-text-muted hover:text-neon-blue hover:bg-cyber-hover transition-all cursor-pointer border border-cyber-border bg-cyber-black"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </motion.aside>
  )
}
