import { motion } from 'framer-motion'
import { Bell, Search, Menu, User, Settings, ChevronDown } from 'lucide-react'
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
      className="sticky top-0 z-30 h-14 flex items-center justify-between px-5 border-b border-cyber-border/40"
      style={{
        background: 'linear-gradient(180deg, rgba(6,6,15,0.95), rgba(6,6,15,0.85))',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-white/[0.04] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3 text-text-muted" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-64 pl-9 pr-4 py-1.5 rounded-lg bg-white/[0.03] border border-cyber-border/40 text-[13px] text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-blue/30 focus:bg-white/[0.05] transition-all"
          />
          <kbd className="absolute right-3 text-[9px] text-text-muted bg-cyber-dark px-1.5 py-0.5 rounded border border-cyber-border/50">⌘K</kbd>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-white/[0.04] text-text-muted hover:text-text-primary transition-colors cursor-pointer">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-neon-red rounded-full" />
        </button>

        <button className="p-2 rounded-lg hover:bg-white/[0.04] text-text-muted hover:text-text-primary transition-colors cursor-pointer mr-2">
          <Settings size={17} />
        </button>

        {/* Google Translate target */}
        <div id="google_translate_element" className="google-translate-dropdown text-xs select-none"></div>

        <div className="w-[1px] h-6 bg-cyber-border/40 mx-2" />

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-md shadow-neon-blue/10">
            <User size={14} className="text-white" />
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-[12px] font-medium text-text-primary leading-none capitalize">{userName}</span>
            <span className="text-[10px] text-text-muted leading-none mt-0.5">Pro Member</span>
          </div>
          <ChevronDown size={12} className="text-text-muted hidden sm:block" />
        </motion.button>
      </div>
    </motion.header>
  )
}
