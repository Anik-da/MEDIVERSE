import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, Phone, MapPin, Shield, Calendar, Edit3, Camera, 
  Activity, Heart, Award, Check, X, AlertCircle 
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import GlowCard from '../components/GlowCard'
import { useAuth } from '../context/AuthContext'
import { updateUserProfile } from '../services/firebaseService'

export default function UserProfile() {
  const { currentUser, userProfile, refreshProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Edit fields
  const [editName, setEditName] = useState(userProfile?.name || currentUser?.displayName || '')
  const [editEmail, setEditEmail] = useState(userProfile?.email || currentUser?.email || '')
  const [editPhone, setEditPhone] = useState(userProfile?.phone || currentUser?.phoneNumber || '')
  const [editLocation, setEditLocation] = useState(userProfile?.location || '')
  const [editEmergencyNumber, setEditEmergencyNumber] = useState(userProfile?.emergencyNumber || '')
  const [editEmergencyEmail, setEditEmergencyEmail] = useState(userProfile?.emergencyEmail || '')

  const nameVal = userProfile?.name || currentUser?.displayName || 'Anik Das'
  const emailVal = userProfile?.email || currentUser?.email || 'anik@mediverse.ai'
  const phoneVal = userProfile?.phone || currentUser?.phoneNumber || '+91 98765 43210'
  const locationVal = userProfile?.location || 'Kolkata, West Bengal'
  
  const createdAtVal = currentUser?.metadata?.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : 'January 2026'

  const badges = [
    { label: '30-Day Streak', icon: Award, color: '#0F4C81' },
    { label: 'Health Champion', icon: Heart, color: '#FF9933' },
    { label: 'Wellness Pro', icon: Activity, color: '#14B8A6' },
  ]

  const handleSaveChanges = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await updateUserProfile(currentUser.uid, {
        name: editName,
        email: editEmail,
        phone: editPhone,
        location: editLocation,
        emergencyNumber: editEmergencyNumber,
        emergencyEmail: editEmergencyEmail,
      })
      await refreshProfile()
      setSuccess('Clinical identity updated successfully!')
      setIsEditing(false)
    } catch (err) {
      console.error(err)
      setError('Failed to update clinical profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader icon={User} title="User Profile" subtitle="Manage your physiological characteristics and registered emergency routing contacts." />

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-neon-red/20 text-neon-red text-xs font-bold flex items-center gap-2">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold flex items-center gap-2">
          <Check size={14} />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <GlowCard hover={false} className="bg-white border border-cyber-border rounded-3xl p-6 text-center">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-lg shadow-neon-blue/10">
                  <User size={40} className="text-white" />
                </div>
              </div>
              <h3 className="font-heading text-lg font-black text-text-primary">{nameVal}</h3>
              <p className="text-xs text-text-secondary font-medium">Verified Patient Member</p>

              <div className="flex gap-3 mt-5">
                {badges.map((b, i) => {
                  const Icon = b.icon
                  return (
                    <motion.div 
                      key={i} 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-cyber-border bg-cyber-black" 
                      title={b.label}
                    >
                      <Icon size={18} style={{ color: b.color }} />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </GlowCard>

          {/* Medical Indicators */}
          <GlowCard hover={false} className="bg-white border border-cyber-border rounded-3xl p-6 text-left">
            <h3 className="font-heading text-xs font-extrabold mb-4 text-text-primary uppercase tracking-wider">Clinical Attributes</h3>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center border-b border-cyber-border pb-2.5">
                <span className="text-xs text-text-secondary">Blood Group</span>
                <span className="text-xs font-extrabold text-neon-red bg-red-50 px-2 py-0.5 rounded-full">B+ Positive</span>
              </div>
              <div className="flex justify-between items-center border-b border-cyber-border pb-2.5">
                <span className="text-xs text-text-secondary">Allergies</span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Penicillin</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-secondary">Conditions</span>
                <span className="text-[10px] font-bold text-neon-purple bg-neon-purple/5 px-2 py-0.5 rounded-full border border-neon-purple/10">Mild Asthma</span>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* Dynamic Personal & Emergency Details Block */}
        <div className="lg:col-span-2 space-y-4">
          <GlowCard hover={false} className="bg-white border border-cyber-border rounded-3xl p-6 text-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xs font-extrabold text-text-primary uppercase tracking-wider">Identity & Routing Records</h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="text-xs text-neon-blue font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Edit3 size={13} /> Edit Profile
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="text-xs text-text-secondary font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <X size={13} /> Cancel
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div 
                  key="view-profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {[
                    { icon: User, label: 'Full Name', value: nameVal },
                    { icon: Mail, label: 'Personal Email', value: emailVal },
                    { icon: Phone, label: 'Phone Number', value: phoneVal },
                    { icon: MapPin, label: 'GPS Coordinate Address', value: locationVal },
                    { icon: Phone, label: 'Emergency Contact Phone', value: userProfile?.emergencyNumber || 'Not registered', highlight: true },
                    { icon: Mail, label: 'Emergency Contact Email', value: userProfile?.emergencyEmail || 'Not registered', highlight: true },
                    { icon: Calendar, label: 'Member Since', value: createdAtVal },
                    { icon: Shield, label: 'Biometric Status', value: 'Active and Encrypted', isStatus: true },
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <div key={i} className={`p-4 rounded-2xl bg-cyber-black border ${item.highlight ? 'border-neon-red/15 bg-red-50/10' : 'border-cyber-border'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={13} className={item.highlight ? 'text-neon-red' : 'text-neon-blue'} />
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{item.label}</span>
                        </div>
                        <p className={`text-xs font-bold leading-normal ${item.isStatus ? 'text-emerald-600' : 'text-text-primary'}`}>{item.value}</p>
                      </div>
                    )
                  })}
                </motion.div>
              ) : (
                <motion.form 
                  key="edit-profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSaveChanges}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wider text-text-secondary">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wider text-text-secondary">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wider text-text-secondary">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wider text-text-secondary">Home Location / GPS Coordinates</label>
                      <input 
                        type="text" 
                        required
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs"
                      />
                    </div>

                    {/* Emergency Phone */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wider text-neon-red font-extrabold">Emergency Contact Phone</label>
                      <input 
                        type="tel" 
                        required
                        value={editEmergencyNumber}
                        onChange={(e) => setEditEmergencyNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs border-neon-red/30 focus:border-neon-red!"
                      />
                    </div>

                    {/* Emergency Email */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wider text-neon-red font-extrabold">Emergency Contact Email</label>
                      <input 
                        type="email" 
                        required
                        value={editEmergencyEmail}
                        onChange={(e) => setEditEmergencyEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs border-neon-red/30 focus:border-neon-red!"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-cyber-border">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)} 
                      className="px-5 py-2.5 rounded-xl border border-cyber-border text-xs text-text-secondary hover:bg-cyber-hover cursor-pointer font-bold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn-neon-filled text-xs font-bold px-6 py-2.5 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Saving Records...' : 'Save Updates'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </GlowCard>
        </div>
      </div>
    </div>
  )
}
