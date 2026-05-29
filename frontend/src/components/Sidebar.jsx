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
  LogOut,
} from 'lucide-react'

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/home', color: '#3B82F6' },
  { icon: Stethoscope, label: 'Symptom Checker', path: '/symptom-checker', color: '#06B6D4' },
  { icon: ShieldAlert, label: 'Emergency SOS', path: '/emergency', color: '#EF4444' },
  { icon: MapPin, label: 'Hospital Finder', path: '/hospitals', color: '#10B981' },
  { icon: Pill, label: 'Medicine Scanner', path: '/medicine-scanner', color: '#F59E0B' },
  { icon: Brain, label: 'Mental Health', path: '/mental-health', color: '#8B5CF6' },
  { icon: Mic, label: 'Voice Diagnosis', path: '/voice-diagnosis', color: '#EC4899' },
  { icon: FileText, label: 'Report Scanner', path: '/ocr-scanner', color: '#6366F1' },
  { icon: TrendingUp, label: 'Health Analytics', path: '/dashboard', color: '#14B8A6' },
  { icon: User, label: 'Profile', path: '/profile', color: '#3B82F6' },
  { icon: Settings, label: 'Settings', path: '/profile#settings', color: '#64748B' },
]

export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 300 : 84 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 h-screen z-40 flex flex-col border-r border-slate-200/90 bg-gradient-to-b from-slate-50 to-white select-none"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-4 px-6 h-24 border-b border-slate-200/90">
        <div className="w-12 h-12 rounded-none bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-500/10">
          <img src="/logo.png" alt="MediVerse" className="w-8 h-8 object-contain" />
        </div>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col"
          >
            <span className="font-heading text-[15px] font-black text-slate-800 tracking-wider leading-none">
              MEDIVERSE
            </span>
            <span className="text-[11px] text-slate-400 tracking-widest mt-1.5 font-bold uppercase">
              National Care
            </span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-0 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-none">
        {isOpen && (
          <p className="text-[11px] text-slate-400 uppercase tracking-widest font-extrabold px-6 mb-4">
            Main Menu
          </p>
        )}
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.99 }}
              className={`
                w-full flex items-center gap-4 rounded-none transition-all duration-150 cursor-pointer relative group
                ${isOpen ? 'px-6 py-3.5' : 'px-0 py-3.5 justify-center'}
                ${isActive
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }
              `}
            >
              {/* Active flat sharp block background */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 rounded-none border-l-4"
                  style={{
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}ee)`,
                    borderLeftColor: item.color,
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-4">
                {/* Beautiful high-contrast square badge wrapper */}
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-none flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.22)' : `${item.color}10`,
                    border: `1.5px solid ${isActive ? 'rgba(255,255,255,0.5)' : `${item.color}25`}`
                  }}
                >
                  <Icon
                    size={18}
                    className="flex-shrink-0"
                    style={isActive ? { color: '#ffffff' } : { color: item.color }}
                  />
                </div>

                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-[15px] whitespace-nowrap tracking-wide transition-all ${
                      isActive ? 'font-black' : 'font-bold'
                    }`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </div>
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-0 pb-6 space-y-3 border-t border-slate-200/90 pt-4">
        <button
          onClick={async () => {
            await logout()
            navigate('/auth')
          }}
          className={`
            w-full flex items-center gap-4 rounded-none hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all cursor-pointer
            ${isOpen ? 'px-6 py-3.5' : 'px-0 py-3.5 justify-center'}
          `}
        >
          <div
            className="w-10 h-10 flex items-center justify-center rounded-none flex-shrink-0 transition-all bg-red-50 border border-red-200/60"
          >
            <LogOut size={18} className="flex-shrink-0 text-red-500" />
          </div>
          {isOpen && (
            <span className="text-[15px] font-bold whitespace-nowrap text-red-600 uppercase tracking-wider">Log Out</span>
          )}
        </button>

        <div className="px-4">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center h-11 rounded-none text-slate-400 hover:text-blue-500 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200 bg-slate-50"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
