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
      animate={{ width: isOpen ? 280 : 76 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 h-screen z-40 flex flex-col border-r border-slate-200/80 bg-gradient-to-b from-slate-50 to-white"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3.5 px-5 h-20 border-b border-slate-200/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
          <img src="/logo.png" alt="MediVerse" className="w-7 h-7 object-contain" />
        </div>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col"
          >
            <span className="font-heading text-sm font-extrabold text-slate-800 tracking-wider leading-none">
              MEDIVERSE
            </span>
            <span className="text-[10px] text-slate-400 tracking-widest mt-1 font-semibold uppercase">
              National Care
            </span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        {isOpen && (
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold px-3 mb-3">
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
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center gap-3.5 rounded-xl transition-all duration-200 cursor-pointer relative group
                ${isOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'}
                ${isActive
                  ? 'text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
                }
              `}
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                    boxShadow: `0 4px 15px ${item.color}30`,
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3.5">
                <Icon
                  size={20}
                  className="flex-shrink-0"
                  style={isActive ? { color: '#ffffff' } : { color: item.color }}
                />
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium whitespace-nowrap"
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
      <div className="px-3 pb-4 space-y-2 border-t border-slate-200/80 pt-3">
        <button
          onClick={async () => {
            await logout()
            navigate('/auth')
          }}
          className={`
            w-full flex items-center gap-3.5 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all cursor-pointer
            ${isOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'}
          `}
        >
          <LogOut size={20} className="flex-shrink-0 text-red-400" />
          {isOpen && (
            <span className="text-sm font-semibold whitespace-nowrap text-red-500">Log Out</span>
          )}
        </button>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center h-10 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200 bg-slate-50"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </motion.aside>
  )
}
