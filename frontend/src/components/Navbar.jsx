import { motion } from 'framer-motion'
import { Bell, Search, Menu, User, ShieldAlert, Globe } from 'lucide-react'
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
      className="sticky top-0 z-30 h-24 flex items-center justify-between px-8 border-b border-slate-200/90 bg-white select-none"
    >
      {/* Left Side: Toggle Menu Button & Mobile-Only Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-3 rounded-none hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Mobile-Only Logo Branding (hidden on desktop to avoid duplicating sidebar) */}
        <div onClick={() => navigate('/home')} className="flex items-center gap-2 cursor-pointer md:hidden">
          <img src="/logo.png" alt="MediVerse Logo" className="w-10 h-10 object-contain rounded-none" />
          <span className="font-heading font-black text-base text-slate-800 tracking-wider">
            MEDIVERSE
          </span>
        </div>
      </div>

      {/* Middle: Expanded Spacious Search Bar */}
      <div className="relative hidden md:flex items-center w-110">
        <Search size={16} className="absolute left-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search symptoms, hospitals, medicines, tests..."
          className="w-full pl-12 pr-4 py-3 rounded-none bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
        />
      </div>

      {/* Right: Notifications, Emergency SOS, Profile Avatar */}
      <div className="flex items-center gap-4">
        {/* Google Translate target */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-none h-11 select-none shadow-sm">
          <Globe size={15} className="text-blue-600 animate-pulse flex-shrink-0" />
          <div id="google_translate_element" className="google-translate-dropdown text-xs font-semibold text-slate-700"></div>
        </div>

        {/* Notifications */}
        <button className="relative p-3 rounded-none hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-none" />
        </button>

        {/* Dynamic Red Emergency SOS Button - ALWAYS VISIBLE */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/emergency')}
          className="px-5 py-3 rounded-none bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all cursor-pointer border border-red-600/10"
        >
          <ShieldAlert size={15} />
          <span>Emergency SOS</span>
        </motion.button>

        <div className="w-[1px] h-8 bg-slate-200 mx-1" />

        {/* User Profile avatar */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3.5 pl-1.5 pr-4 py-1.5 rounded-none hover:bg-slate-50 transition-colors cursor-pointer border border-transparent"
        >
          <div className="w-10 h-10 rounded-none bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-sm">
            <User size={18} className="text-white" />
          </div>
          <div className="hidden xl:flex flex-col items-start text-left">
            <span className="text-[13px] font-black text-slate-800 leading-none capitalize">{userName}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mt-1">Verified Indian Patient</span>
          </div>
        </motion.button>
      </div>
    </motion.header>
  )
}
