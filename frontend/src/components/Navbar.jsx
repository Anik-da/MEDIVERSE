import { motion } from 'framer-motion'
import { Bell, Search, Menu, User, ShieldAlert, HeartPulse } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  // Get dynamic name
  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Anik Das'

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-30 h-20 flex items-center justify-between px-6 border-b border-cyber-border bg-white"
    >
      {/* Left: Brand Logo & Hamburger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2.5 rounded-xl hover:bg-cyber-hover text-text-secondary hover:text-neon-blue transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Logo Branding */}
        <div onClick={() => navigate('/home')} className="flex items-center gap-2 cursor-pointer select-none">
          <img src="/logo.png" alt="MediVerse Logo" className="w-10 h-10 object-contain rounded-xl" />
          <span className="font-heading font-extrabold text-lg text-neon-blue tracking-wide hidden sm:block">
            MEDIVERSE AI
          </span>
        </div>
      </div>

      {/* Middle: Professional Search Bar */}
      <div className="relative hidden md:flex items-center w-80">
        <Search size={15} className="absolute left-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search symptoms, hospitals, medicines..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-cyber-black border border-cyber-border text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-blue/50 transition-all"
        />
      </div>

      {/* Right: Notification, Emergency, Avatar */}
      <div className="flex items-center gap-3">
        {/* Google Translate target */}
        <div id="google_translate_element" className="google-translate-dropdown text-xs select-none mr-2 hidden lg:block"></div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-cyber-hover text-text-secondary hover:text-neon-blue transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-neon-red rounded-full" />
        </button>

        {/* Dynamic Red Emergency SOS Button - ALWAYS VISIBLE */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/emergency')}
          className="px-4 py-2 rounded-xl bg-neon-red text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-neon-red/15 hover:bg-red-600 transition-all cursor-pointer"
        >
          <ShieldAlert size={14} />
          <span>Emergency SOS</span>
        </motion.button>

        <div className="w-[1px] h-6 bg-cyber-border mx-1" />

        {/* User Profile avatar */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-xl hover:bg-cyber-hover transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-md">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-[12px] font-semibold text-text-primary leading-none capitalize">{userName}</span>
            <span className="text-[10px] text-text-muted leading-none mt-0.5">Verified Indian Patient</span>
          </div>
        </motion.button>
      </div>
    </motion.header>
  )
}
