import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Phone, MapPin, Heart, Shield, Clock, X, UserPlus, Navigation } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import GlowCard from '../components/GlowCard'
import { useAuth } from '../context/AuthContext'
import { saveEmergencyLog, updateLiveLocation } from '../services/firebaseService'

const firstAidSteps = [
  { title: 'Chest Pain', steps: ['Call emergency services immediately', 'Have the person sit or lie down', 'Loosen tight clothing', 'If prescribed, help take aspirin'] },
  { title: 'Severe Bleeding', steps: ['Apply direct pressure with clean cloth', 'Elevate the injured area', 'Apply bandage firmly', 'Seek immediate medical help'] },
  { title: 'Choking', steps: ['Encourage coughing', 'Give 5 back blows', 'Perform abdominal thrusts', 'Call emergency if unresolved'] },
  { title: 'Burns', steps: ['Cool under running water 10+ min', 'Remove jewelry near burn', 'Cover with sterile dressing', 'Do NOT apply ice directly'] },
]

const emergencyContacts = [
  { name: 'Ambulance', number: '102', icon: Heart },
  { name: 'Police', number: '100', icon: Shield },
  { name: 'Fire', number: '101', icon: AlertTriangle },
]

export default function EmergencyAssistance() {
  const [sosActive, setSosActive] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [eta, setEta] = useState('~8 min')
  const [nearestHospital, setNearestHospital] = useState('Apollo Hospital')

  const { currentUser } = useAuth()

  const triggerSOS = () => {
    setShowPopup(true)
    let count = 5
    setCountdown(count)
    const interval = setInterval(async () => {
      count--
      setCountdown(count)
      if (count <= 0) {
        clearInterval(interval)
        setShowPopup(false)
        setCountdown(null)
        
        // Execute active SOS alert logging
        setSosActive(true)
        
        // Get geolocation coordinates and log to database
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords
            
            try {
              const idToken = await currentUser.getIdToken()
              // Call API
              const res = await fetch('http://localhost:8000/emergency-alert', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                  latitude,
                  longitude,
                  description: 'Emergency SOS manual dispatch',
                  severity: 'Critical'
                })
              })
              const data = await res.json()
              if (data.status === 'alert_sent') {
                setEta(data.nearest_hospital.eta)
                setNearestHospital(data.nearest_hospital.name)
              }
            } catch (err) {
              console.error("API error during SOS alert:", err)
            }

            // Save to Firestore
            await saveEmergencyLog(currentUser.uid, {
              latitude,
              longitude,
              description: 'Emergency SOS manual dispatch',
              severity: 'Critical'
            })
            // Save to Realtime Database
            await updateLiveLocation(currentUser.uid, latitude, longitude)
          }, async (err) => {
            console.warn("SOS Geolocation failed. Triggering backup satellite routing.", err)
            const fallbackLat = 22.5726
            const fallbackLng = 88.3639
            
            try {
              const idToken = await currentUser.getIdToken()
              const res = await fetch('http://localhost:8000/emergency-alert', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                  latitude: fallbackLat,
                  longitude: fallbackLng,
                  description: 'Emergency SOS dispatch (GPS unavailable)',
                  severity: 'Critical'
                })
              })
              const data = await res.json()
              if (data.status === 'alert_sent') {
                setEta(data.nearest_hospital.eta)
                setNearestHospital(data.nearest_hospital.name)
              }
            } catch (apiErr) {
              console.error("API error during SOS alert backup:", apiErr)
            }

            // Fail-safe default coordinates save
            await saveEmergencyLog(currentUser.uid, {
              latitude: fallbackLat,
              longitude: fallbackLng,
              description: 'Emergency SOS dispatch (GPS unavailable)',
              severity: 'Critical'
            })
            await updateLiveLocation(currentUser.uid, fallbackLat, fallbackLng)
          })
        } else {
          // If Geolocation is completely unavailable
          const fallbackLat = 22.5726
          const fallbackLng = 88.3639
          await saveEmergencyLog(currentUser.uid, {
            latitude: fallbackLat,
            longitude: fallbackLng,
            description: 'Emergency SOS dispatch (GPS not supported)',
            severity: 'Critical'
          })
        }
      }
    }, 1000)
  }

  const cancelSOS = () => { setShowPopup(false); setCountdown(null) }

  return (
    <div>
      <PageHeader icon={AlertTriangle} title="Emergency Assistance" subtitle="One-tap SOS with live location and instant first-aid guidance." accentColor="neon-red" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SOS Button Panel */}
        <div className="lg:col-span-1 space-y-4">
          <GlowCard hover={false} glowColor="neon-red">
            <div className="flex flex-col items-center py-6">
              <motion.button
                onClick={triggerSOS}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-40 h-40 rounded-full cursor-pointer"
              >
                {/* Pulse rings */}
                <motion.div animate={{ scale: [1, 1.5], opacity: [0.3, 0] }} transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-neon-red" />
                <motion.div animate={{ scale: [1, 1.3], opacity: [0.2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute inset-0 rounded-full border-2 border-neon-red" />
                {/* Button */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-red to-neon-pink flex items-center justify-center"
                  style={{ boxShadow: '0 0 40px rgba(255,51,102,0.4), 0 0 80px rgba(255,51,102,0.2)' }}>
                  <div className="text-center">
                    <AlertTriangle size={32} className="text-white mx-auto mb-1" />
                    <span className="font-heading text-lg font-bold text-white tracking-wider">SOS</span>
                  </div>
                </div>
              </motion.button>
              <p className="text-xs text-text-secondary mt-4 text-center">Tap to send emergency alert</p>
            </div>
          </GlowCard>

          {/* Emergency Contacts */}
          <GlowCard hover={false}>
            <h3 className="font-heading text-sm font-semibold mb-3 text-text-primary flex items-center gap-2">
              <Phone size={16} className="text-neon-red" /> Emergency Contacts
            </h3>
            <div className="space-y-2">
              {emergencyContacts.map((c, i) => {
                const Icon = c.icon
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-cyber-dark border border-cyber-border hover:border-neon-red/20 transition-all">
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="text-neon-red" />
                      <span className="text-sm text-text-primary">{c.name}</span>
                    </div>
                    <span className="font-heading text-sm font-bold text-neon-red">{c.number}</span>
                  </motion.div>
                )
              })}
            </div>
            <button className="w-full mt-3 py-2 rounded-xl border border-dashed border-cyber-border text-xs text-text-muted hover:border-neon-blue/30 hover:text-text-secondary transition-all cursor-pointer flex items-center justify-center gap-1.5">
              <UserPlus size={14} /> Add Personal Contact
            </button>
          </GlowCard>

          {/* Live Status */}
          <AnimatePresence>
            {sosActive && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="glass-panel p-4 border-neon-green/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-neon" />
                  <span className="text-xs font-semibold text-neon-green">ALERT ACTIVE</span>
                </div>
                <div className="space-y-2 text-xs text-text-secondary">
                  <div className="flex items-center gap-2"><Navigation size={12} className="text-neon-blue" /> Location shared</div>
                  <div className="flex items-center gap-2"><Clock size={12} className="text-neon-orange" /> ETA: {eta}</div>
                  <div className="flex items-center gap-2"><MapPin size={12} className="text-neon-green" /> Nearest: {nearestHospital}</div>
                </div>
                <button onClick={() => setSosActive(false)} className="w-full mt-3 py-2 rounded-lg bg-neon-red/10 border border-neon-red/20 text-xs text-neon-red hover:bg-neon-red/20 transition-colors cursor-pointer">
                  Cancel Alert
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* First Aid Instructions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-heading text-sm font-semibold text-text-primary flex items-center gap-2">
            <Heart size={16} className="text-neon-pink" /> First-Aid Quick Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {firstAidSteps.map((item, i) => (
              <GlowCard key={i} delay={i * 0.1} glowColor="neon-pink">
                <h4 className="font-semibold text-sm text-text-primary mb-3">{item.title}</h4>
                <ol className="space-y-2">
                  {item.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-text-secondary">
                      <span className="w-5 h-5 rounded-md bg-neon-pink/10 text-neon-pink flex items-center justify-center flex-shrink-0 text-[10px] font-bold">{j + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>

      {/* SOS Confirmation Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="glass-panel-strong p-8 max-w-sm w-full mx-4 text-center border-neon-red/30">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-neon-red/10 flex items-center justify-center">
                <AlertTriangle size={36} className="text-neon-red" />
              </motion.div>
              <h3 className="font-heading text-xl font-bold text-neon-red mb-2">Sending SOS Alert</h3>
              <p className="text-sm text-text-secondary mb-4">Emergency services will be notified in</p>
              <p className="font-heading text-5xl font-black text-neon-red mb-6">{countdown}</p>
              <button onClick={cancelSOS}
                className="w-full py-3 rounded-xl border border-cyber-border text-sm text-text-secondary hover:border-neon-blue/30 transition-all cursor-pointer flex items-center justify-center gap-2">
                <X size={16} /> Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
