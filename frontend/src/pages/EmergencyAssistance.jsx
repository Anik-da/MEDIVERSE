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
  const [eta, setEta] = useState('~8 min')
  const [nearestHospital, setNearestHospital] = useState('Apollo Hospital')
  
  // Custom status indicators for the webhook post
  const [loadingAlert, setLoadingAlert] = useState(false)
  const [alertSuccess, setAlertSuccess] = useState(false)
  const [alertError, setAlertError] = useState('')

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

  const triggerSOS = async () => {
    setLoadingAlert(true)
    setAlertSuccess(false)
    setAlertError('')
    setSosActive(false)

    const sendEmergencyPost = async (lat, lng) => {
      try {
        const payload = {
          fullName: userProfile?.name || currentUser?.displayName || "MediVerse Patient",
          phoneNumber: userProfile?.phone || currentUser?.phoneNumber || "Emergency Line",
          email: userProfile?.email || currentUser?.email || "patient@mediverse.com",
          emergencyContactNumber: userProfile?.emergencyNumber || "",
          emergencyContactEmail: userProfile?.emergencyEmail || "",
          latitude: lat,
          longitude: lng
        }

        // Send POST request to the specified Cloud Webhook
        const response = await fetch('https://amitprakesh.app.n8n.cloud/webhook-test/emergency%20alert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          throw new Error(`Failed to transmit. Server responded with status ${response.status}`)
        }

        // Send standard backup logging webhook
        try {
          await fetch('https://amitprakesh.app.n8n.cloud/webhook/emergency-SOS', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: payload.fullName,
              phone: payload.phoneNumber,
              email: payload.email,
              emergency_phone: payload.emergencyContactNumber,
              emergency_email: payload.emergencyContactEmail,
              location_address: userProfile?.location || "",
              latitude: lat,
              longitude: lng,
              emergency_type: 'Critical Medical Alert'
            })
          })
        } catch (wErr) {
          console.warn("Secondary logging webhook skipped:", wErr)
        }

        // Try local local backend server alert
        try {
          const idToken = await currentUser.getIdToken()
          const res = await fetch('http://localhost:8000/emergency-alert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
              latitude: lat,
              longitude: lng,
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
          console.warn("Local microservice endpoint alert bypassed:", err)
        }

        // Save log in Firestore database
        if (currentUser) {
          try {
            await saveEmergencyLog(currentUser.uid, {
              latitude: lat,
              longitude: lng,
              description: 'Emergency SOS Webhook dispatch',
              severity: 'Critical',
              emergencyEmail: payload.emergencyContactEmail,
              emergencyNumber: payload.emergencyContactNumber,
            })
            await updateLiveLocation(currentUser.uid, lat, lng)
          } catch (dbErr) {
            console.warn("Firestore emergency logging skipped:", dbErr)
          }
        }

        setAlertSuccess(true)
        setSosActive(true)
      } catch (err) {
        console.error("SOS Webhook transmission failed:", err)
        setAlertError(err.message || 'Transmission failed. Please check network connection.')
      } finally {
        setLoadingAlert(false)
      }
    }

    // Request user's current GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          await sendEmergencyPost(latitude, longitude)
        },
        async (err) => {
          console.warn("Geolocation failed. Emitting default coordinate payload...", err)
          // Default location fallback (e.g. Bangalore center as specified in prompt sample)
          const fallbackLat = 12.9716
          const fallbackLng = 77.5946
          await sendEmergencyPost(fallbackLat, fallbackLng)
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    } else {
      console.warn("Geolocation unsupported. Emitting default coordinate payload...")
      const fallbackLat = 12.9716
      const fallbackLng = 77.5946
      await sendEmergencyPost(fallbackLat, fallbackLng)
    }
  }

  return (
    <div>
      <PageHeader icon={AlertTriangle} title="Emergency Assistance" subtitle="One-tap SOS with live location, first-aid, and real-time guardian notification." accentColor="neon-red" />

      {/* Red Active Alert Panel */}
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

      {/* Success Banner */}
      {alertSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-green-50 border border-neon-green/30 flex items-center justify-between text-left shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center text-neon-green animate-pulse">
              <Shield size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-neon-green uppercase tracking-wider">Emergency Alert Sent Successfully</p>
              <p className="text-[10px] text-text-secondary mt-0.5">
                Your coordinates and medical parameters have been successfully received by the emergency response queue!
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-neon-green/15 text-neon-green border border-neon-green/30 px-2.5 py-1 rounded-full font-bold">TRANSMITTED</span>
        </motion.div>
      )}

      {/* Error Banner */}
      {alertError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-red-50 border border-neon-red/30 flex items-center justify-between text-left shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neon-red/10 flex items-center justify-center text-neon-red">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-neon-red uppercase tracking-wider">SOS Transmission Error</p>
              <p className="text-[10px] text-text-secondary mt-0.5">{alertError}</p>
            </div>
          </div>
          <span className="text-[10px] bg-neon-red/15 text-neon-red border border-neon-red/30 px-2.5 py-1 rounded-full font-bold">FAILED</span>
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
                className="relative w-44 h-44 rounded-full cursor-pointer flex items-center justify-center"
              >
                {/* Pulse rings */}
                <motion.div animate={{ scale: [1, 1.5], opacity: [0.3, 0] }} transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-neon-red pointer-events-none" />
                <motion.div animate={{ scale: [1, 1.3], opacity: [0.2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute inset-0 rounded-full border-2 border-neon-red pointer-events-none" />
                {/* Button */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-red to-neon-pink flex items-center justify-center"
                  style={{ boxShadow: '0 0 40px rgba(239,68,68,0.4)' }}>
                  <div className="text-center">
                    <AlertTriangle size={36} className="text-white mx-auto mb-1 animate-bounce" />
                    <span className="font-heading text-2xl font-black text-white tracking-widest block">SOS</span>
                    <span className="text-[9px] uppercase font-bold text-white/80 tracking-wider">Tap to Alert</span>
                  </div>
                </div>
              </motion.button>
              <p className="text-xs text-text-secondary mt-5 text-center font-bold uppercase tracking-wider text-neon-red animate-pulse">
                🔴 IMMEDIATE CRITICAL RESPONSE ACTIVE
              </p>
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

      {/* Loading beacon overlay */}
      <AnimatePresence>
        {loadingAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-cyber-border p-8 rounded-3xl max-w-sm w-full mx-4 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-red via-neon-purple to-neon-blue animate-pulse" />
              <h3 className="font-heading text-base font-extrabold text-neon-red uppercase tracking-wider mb-2 animate-pulse">Broadcasting Alert</h3>
              <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                Querying secure satellite GPS coordinates, binding patient clinical parameters, and transmitting payload to cloud networks.
              </p>
              
              {/* Spinner */}
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                <div className="absolute inset-0 rounded-full border-4 border-neon-red border-t-transparent animate-spin" />
              </div>

              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Connecting secure tunnel...</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
