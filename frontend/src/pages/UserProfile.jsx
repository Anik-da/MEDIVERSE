import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Shield, Calendar, Edit3, Camera, Activity, Heart, Award } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import GlowCard from '../components/GlowCard'
import { useAuth } from '../context/AuthContext'

export default function UserProfile() {
  const { currentUser, userProfile } = useAuth()

  const nameVal = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Anik Das'
  const emailVal = currentUser?.email || 'anik@mediverse.ai'
  const createdAtVal = currentUser?.metadata?.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : 'January 2026'

  const profileData = {
    name: nameVal,
    email: emailVal,
    phone: userProfile?.phone || '+91 98765 43210',
    location: userProfile?.location || 'Kolkata, India',
    joined: createdAtVal,
    bloodType: userProfile?.bloodType || 'B+',
    age: userProfile?.age || 24,
    allergies: userProfile?.allergies || ['Penicillin', 'Dust Mites'],
    conditions: userProfile?.conditions || ['Mild Asthma'],
  }

  const badges = [
    { label: '30-Day Streak', icon: Award, color: '#00F0FF' },
    { label: 'Health Champion', icon: Heart, color: '#EC4899' },
    { label: 'Wellness Pro', icon: Activity, color: '#00FF88' },
  ]
  return (
    <div>
      <PageHeader icon={User} title="User Profile" subtitle="Manage your health profile and preferences." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1 space-y-4">
          <GlowCard hover={false}>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center"
                  style={{ boxShadow: '0 0 30px rgba(0,240,255,0.2)' }}>
                  <User size={40} className="text-white" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-cyber-dark border border-cyber-border flex items-center justify-center text-text-muted hover:text-neon-blue transition-colors cursor-pointer">
                  <Camera size={14} />
                </button>
              </div>
              <h3 className="font-heading text-lg font-bold text-text-primary">{profileData.name}</h3>
              <p className="text-xs text-text-secondary">MediVerse Member</p>

              <div className="flex gap-3 mt-4">
                {badges.map((b, i) => {
                  const Icon = b.icon
                  return (
                    <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center" title={b.label}
                      style={{ backgroundColor: `${b.color}15`, border: `1px solid ${b.color}30` }}>
                      <Icon size={18} style={{ color: b.color }} />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </GlowCard>

          <GlowCard hover={false}>
            <h3 className="font-heading text-sm font-semibold mb-3 text-text-primary">Medical Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-muted">Blood Type</span>
                <span className="text-sm font-semibold text-neon-red">{profileData.bloodType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-muted">Age</span>
                <span className="text-sm text-text-primary">{profileData.age}</span>
              </div>
              <div>
                <span className="text-xs text-text-muted block mb-1.5">Allergies</span>
                <div className="flex flex-wrap gap-1.5">
                  {profileData.allergies.map((a, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-neon-orange/10 text-neon-orange border border-neon-orange/20">{a}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-text-muted block mb-1.5">Conditions</span>
                <div className="flex flex-wrap gap-1.5">
                  {profileData.conditions.map((c, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-neon-purple/10 text-neon-purple border border-neon-purple/20">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          <GlowCard hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-semibold text-text-primary">Personal Information</h3>
              <button className="text-xs text-neon-blue flex items-center gap-1 hover:underline cursor-pointer">
                <Edit3 size={12} /> Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: User, label: 'Full Name', value: profileData.name },
                { icon: Mail, label: 'Email', value: profileData.email },
                { icon: Phone, label: 'Phone', value: profileData.phone },
                { icon: MapPin, label: 'Location', value: profileData.location },
                { icon: Calendar, label: 'Member Since', value: profileData.joined },
                { icon: Shield, label: 'Account Status', value: 'Verified', isStatus: true },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl bg-cyber-dark border border-cyber-border">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon size={14} className="text-neon-blue" />
                      <span className="text-xs text-text-muted">{item.label}</span>
                    </div>
                    <p className={`text-sm font-medium ${item.isStatus ? 'text-neon-green' : 'text-text-primary'}`}>{item.value}</p>
                  </motion.div>
                )
              })}
            </div>
          </GlowCard>

          {/* Health Score */}
          <GlowCard hover={false}>
            <h3 className="font-heading text-sm font-semibold mb-4 text-text-primary">AI Health Score</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.92) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }} />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00F0FF" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="font-heading text-2xl font-black gradient-text">92</span>
                    <p className="text-[10px] text-text-muted">/100</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {[
                  { label: 'Physical Health', pct: 88, color: '#00F0FF' },
                  { label: 'Mental Wellness', pct: 75, color: '#A855F7' },
                  { label: 'Sleep Quality', pct: 82, color: '#EC4899' },
                  { label: 'Nutrition', pct: 91, color: '#00FF88' },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">{m.label}</span>
                      <span style={{ color: m.color }}>{m.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-cyber-dark overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="h-full rounded-full" style={{ backgroundColor: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  )
}
