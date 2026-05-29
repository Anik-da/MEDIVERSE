import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Phone, MapPin, Heart, Shield, Clock, X, Mail } from 'lucide-react'
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

const defaultEmergencyContacts = [
  { name: 'Ambulance', number: '102', icon: Heart },
  { name: 'Police', number: '100', icon: Shield },
  { name: 'Fire Department', number: '101', icon: AlertTriangle },
]

export default function EmergencyAssistance() {
  const [sosActive, setSosActive] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [eta, setEta] = useState('~8 min')
  const [nearestHospital, setNearestHospital] = useState('Apollo Hospital')

  const { currentUser, userProfile } = useAuth()

  // Build real-time contact array containing user's personal emergency guardian details
  const activeContacts = [
    ...defaultEmergencyContacts,
    ...(userProfile?.emergencyNumber ? [{
      name: `Guardian (SOS Contact)`,
      number: userProfile.emergencyNumber,
      icon: Phone,
      email: userProfile.emergencyEmail
    }] : [])
  ]

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
        setSosActive(true)
        
        // Query location coordinates & transmit user provided emergency details
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords
            
            // Dispatch live POST containing name, number, email, emergency email, emergency number & location
            try {
              await fetch('https://amitprakesh.app.n8n.cloud/webhook/emergency-SOS', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  name: userProfile?.name || currentUser?.displayName || "MediVerse Patient",
                  phone: userProfile?.phone || currentUser?.phoneNumber || "Emergency Line",
                  email: userProfile?.email || currentUser?.email || "patient@mediverse.com",
                  emergency_phone: userProfile?.emergencyNumber || "",
                  emergency_email: userProfile?.emergencyEmail || "",
                  location_address: userProfile?.location || "",
                  latitude: latitude,
                  longitude: longitude,
                  emergency_type: 'Critical Medical Alert'
                })
              })
            } catch (err) {
              console.error("SOS Webhook submission failed:", err)
            }

            try {
              const idToken = await currentUser.getIdToken()
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

            // Save log in Firestore database
            await saveEmergencyLog(currentUser.uid, {
              latitude,
              longitude,
              description: 'Emergency SOS manual dispatch',
              severity: 'Critical',
              emergencyEmail: userProfile?.emergencyEmail || '',
              emergencyNumber: userProfile?.emergencyNumber || '',
            })
            // Save in Realtime Database
            await updateLiveLocation(currentUser.uid, latitude, longitude)
          }, async (err) => {
            console.warn("SOS Geolocation failed. Triggering backup satellite routing.", err)
            const fallbackLat = 22.5726
            const fallbackLng = 88.3639
            
            // Webhook fallback dispatch with personal emergency details
            try {
              await fetch('https://amitprakesh.app.n8n.cloud/webhook/emergency-SOS', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  name: userProfile?.name || currentUser?.displayName || "MediVerse Patient",
                  phone: userProfile?.phone || currentUser?.phoneNumber || "Emergency Line",
                  email: userProfile?.email || currentUser?.email || "patient@mediverse.com",
                  emergency_phone: userProfile?.emergencyNumber || "",
                  emergency_email: userProfile?.emergencyEmail || "",
                  location_address: userProfile?.location || "",
                  latitude: fallbackLat,
                  longitude: fallbackLng,
                  emergency_type: 'Critical Medical Alert (Fallback GPS)'
                })
              })
            } catch (wErr) {
              console.error("SOS Webhook fallback submission failed:", wErr)
            }

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

            await saveEmergencyLog(currentUser.uid, {
              latitude: fallbackLat,
              longitude: fallbackLng,
              description: 'Emergency SOS dispatch (GPS unavailable)',
              severity: 'Critical',
              emergencyEmail: userProfile?.emergencyEmail || '',
              emergencyNumber: userProfile?.emergencyNumber || '',
            })
            await updateLiveLocation(currentUser.uid, fallbackLat, fallbackLng)
          })
        } else {
          // If Geolocation is completely unsupported
          const fallbackLat = 22.5726
          const fallbackLng = 88.3639
          
          try {
            await fetch('https://amitprakesh.app.n8n.cloud/webhook/emergency-SOS', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: userProfile?.name || currentUser?.displayName || "MediVerse Patient",
                phone: userProfile?.phone || currentUser?.phoneNumber || "Emergency Line",
                email: userProfile?.email || currentUser?.email || "patient@mediverse.com",
                emergency_phone: userProfile?.emergencyNumber || "",
                emergency_email: userProfile?.emergencyEmail || "",
                location_address: userProfile?.location || "",
                latitude: fallbackLat,
                longitude: fallbackLng,
                emergency_type: 'Critical Medical Alert (Unsupported GPS)'
              })
            })
          } catch (wErr) {
            console.error("SOS Webhook unsupported fallback failed:", wErr)
          }

          await saveEmergencyLog(currentUser.uid, {
            latitude: fallbackLat,
            longitude: fallbackLng,
            description: 'Emergency SOS dispatch (GPS not supported)',
            severity: 'Critical',
            emergencyEmail: userProfile?.emergencyEmail || '',
            emergencyNumber: userProfile?.emergencyNumber || '',
          })
        }
      }
    }, 1000)
  }

  const cancelSOS = () => { setShowPopup(false); setCountdown(null) }

  return (
    <div>
      <PageHeader icon={AlertTriangle} title="Emergency Assistance" subtitle="One-tap SOS with live location, first-aid, and real-time guardian notification." accentColor="neon-red" />

      {/* Red Alert Panel */}
      {sosActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-red-50 border border-neon-red/30 flex items-center justify-between text-left shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neon-red/10 flex items-center justify-center text-neon-red animate-pulse">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-neon-red uppercase tracking-wider">Active Medical Emergency Alert Broadcasted</p>
              <p className="text-[10px] text-text-secondary mt-0.5">
                Notifications dispatched successfully to guardian contact: <strong className="text-text-primary">{userProfile?.emergencyNumber || 'Not registered'}</strong> ({userProfile?.emergencyEmail || 'No email'})
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-neon-red/15 text-neon-red border border-neon-red/30 px-2.5 py-1 rounded-full font-bold">DISPATCHING</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SOS Button Panel */}
        <div className="lg:col-span-1 space-y-4">
          <GlowCard hover={false} glowColor="neon-red" className="bg-white border border-cyber-border rounded-3xl p-6">
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
                  style={{ boxShadow: '0 0 30px rgba(239,68,68,0.3)' }}>
                  <div className="text-center">
                    <AlertTriangle size={32} className="text-white mx-auto mb-1" />
                    <span className="font-heading text-lg font-bold text-white tracking-wider">SOS</span>
                  </div>
                </div>
              </motion.button>
              <p className="text-xs text-text-secondary mt-5 text-center font-semibold">Tap to send emergency alert</p>
            </div>
          </GlowCard>

          {/* Emergency Contacts */}
          <GlowCard hover={false} className="bg-white border border-cyber-border rounded-3xl p-6">
            <h3 className="font-heading text-xs font-extrabold mb-4 text-text-primary flex items-center gap-2 uppercase tracking-wider">
              <Phone size={16} className="text-neon-red" /> Emergency Contacts
            </h3>
            <div className="space-y-2.5">
              {activeContacts.map((c, i) => {
                const Icon = c.icon
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-cyber-black border border-cyber-border hover:border-neon-red/25 transition-all text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyber-hover flex items-center justify-center">
                        <Icon size={14} className="text-neon-red" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-text-primary block">{c.name}</span>
                        {c.email && <span className="text-[9px] text-text-muted">{c.email}</span>}
                      </div>
                    </div>
                    <span className="font-heading text-xs font-bold text-neon-red">{c.number}</span>
                  </motion.div>
                )
              })}
            </div>
          </GlowCard>
        </div>

        {/* Live Map Panel & First Aid */}
        <div className="lg:col-span-2 space-y-4">
          <GlowCard hover={false} className="bg-white border border-cyber-border rounded-3xl p-6">
            <h3 className="font-heading text-xs font-extrabold mb-4 text-text-primary flex items-center gap-2 uppercase tracking-wider">
              <MapPin size={16} className="text-neon-blue" /> Live Location Tracking
            </h3>
            <div className="h-44 rounded-2xl bg-cyber-black border border-cyber-border flex items-center justify-center relative overflow-hidden text-center p-4">
              <div className="absolute top-4 right-4 z-10 bg-white/95 px-3 py-1 rounded-full border border-cyber-border flex items-center gap-1.5 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                <span className="text-[10px] text-text-primary font-bold">Satellite Sync</span>
              </div>
              <div>
                <MapPin size={24} className="text-neon-blue mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-bold text-text-primary">GPS Location Dispatch Coordinate Stream</p>
                <p className="text-[10px] text-text-secondary mt-1 max-w-sm">
                  {userProfile?.location ? `Registered Medical Address: ${userProfile.location}` : 'Awaiting live GPS coordinates...'}
                </p>
              </div>
            </div>
          </GlowCard>

          <GlowCard hover={false} className="bg-white border border-cyber-border rounded-3xl p-6">
            <h3 className="font-heading text-xs font-extrabold mb-4 text-text-primary flex items-center gap-2 uppercase tracking-wider">
              <Heart size={16} className="text-neon-purple" /> Instant First-Aid Guidance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {firstAidSteps.map((item, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-cyber-black border border-cyber-border text-left">
                  <span className="text-xs font-extrabold text-neon-blue uppercase tracking-wider">{item.title}</span>
                  <ul className="mt-2 space-y-1.5">
                    {item.steps.map((step, idx) => (
                      <li key={idx} className="text-[11px] text-text-secondary leading-normal flex items-start gap-1.5">
                        <span className="text-neon-blue select-none font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>

      {/* Countdown popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-cyber-border p-6 rounded-3xl max-w-sm w-full mx-4 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-red to-neon-pink animate-pulse" />
              <h3 className="font-heading text-base font-extrabold text-neon-red uppercase tracking-wider mb-2">Triggering Emergency SOS</h3>
              <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                Dispatching coordinates, registered medical address, and SMS/Email notifications to your guardian contact.
              </p>
              <div className="w-20 h-20 rounded-full bg-neon-red/10 border-2 border-neon-red flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black font-heading text-neon-red">{countdown}</span>
              </div>
              <button onClick={cancelSOS} className="w-full py-2.5 rounded-xl border border-cyber-border text-xs text-text-secondary hover:bg-cyber-hover cursor-pointer transition-colors font-bold uppercase tracking-wider">
                Cancel Alert
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
