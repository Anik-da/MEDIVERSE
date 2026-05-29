import { useState, useEffect } from 'react'
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
  const [liveCoords, setLiveCoords] = useState(null)
  const [locationStatus, setLocationStatus] = useState('detecting')

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

  // Auto-detect GPS location on page load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLiveCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          setLocationStatus('active')
        },
        () => {
          setLiveCoords({ lat: 12.9716, lng: 77.5946 })
          setLocationStatus('fallback')
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    } else {
      setLiveCoords({ lat: 12.9716, lng: 77.5946 })
      setLocationStatus('unsupported')
    }
  }, [])

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
    <div className="space-y-6">
      <PageHeader icon={AlertTriangle} title="Emergency Assistance" subtitle="One-tap SOS with live location, first-aid, and real-time guardian notification." accentColor="neon-red" />

      {/* Status Banners */}
      {sosActive && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 animate-pulse flex-shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-red-500 uppercase tracking-wide">Emergency Alert Active</p>
              <p className="text-xs text-text-secondary mt-1">
                Dispatched to: <strong className="text-text-primary">{userProfile?.emergencyNumber || 'Not registered'}</strong> · {userProfile?.emergencyEmail || 'No email'}
              </p>
            </div>
          </div>
          <span className="text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-1.5 rounded-full font-bold tracking-wide flex-shrink-0">DISPATCHING</span>
        </motion.div>
      )}

      {alertSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 animate-pulse flex-shrink-0">
              <Shield size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-500 uppercase tracking-wide">Emergency Alert Sent Successfully</p>
              <p className="text-xs text-text-secondary mt-1">Your coordinates and medical data have been received by the emergency response system.</p>
            </div>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-1.5 rounded-full font-bold tracking-wide flex-shrink-0">TRANSMITTED</span>
        </motion.div>
      )}

      {alertError && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-red-500 uppercase tracking-wide">SOS Transmission Error</p>
              <p className="text-xs text-text-secondary mt-1">{alertError}</p>
            </div>
          </div>
          <span className="text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-1.5 rounded-full font-bold tracking-wide flex-shrink-0">FAILED</span>
        </motion.div>
      )}

      {/* ===== SECTION 1: SOS Hero Button — Full Width ===== */}
      <GlowCard hover={false} glowColor="neon-red" className="bg-white border border-cyber-border rounded-2xl p-8">
        <div className="flex flex-col items-center py-4">
          <motion.button
            onClick={triggerSOS}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={loadingAlert}
            className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Solid red button — no pulse rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center"
              style={{ boxShadow: '0 0 40px rgba(239,68,68,0.35)' }}>
              <div className="text-center">
                <AlertTriangle size={42} className="text-white mx-auto mb-2" />
                <span className="font-heading text-3xl font-black text-white tracking-widest block">SOS</span>
                <span className="text-[11px] uppercase font-bold text-white/80 tracking-widest mt-1 block">Tap to Alert</span>
              </div>
            </div>
          </motion.button>

          <p className="text-sm text-red-500 mt-6 text-center font-bold uppercase tracking-wider">
            🔴 Tap above to broadcast emergency alert
          </p>
        </div>
      </GlowCard>

      {/* ===== SECTION 2: Contacts + Location — Side by Side ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Emergency Contacts */}
        <GlowCard hover={false} className="bg-white border border-cyber-border rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-5 text-text-primary flex items-center gap-2.5 uppercase tracking-wider">
            <Phone size={18} className="text-red-500" /> Emergency Contacts
          </h3>
          <div className="space-y-3">
            {activeContacts.map((c, i) => {
              const Icon = c.icon
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-cyber-black border border-cyber-border hover:border-red-500/20 transition-all text-left">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-500/8 border border-red-500/10 flex items-center justify-center">
                      <Icon size={18} className="text-red-500" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-text-primary block">{c.name}</span>
                      {c.email && <span className="text-xs text-text-muted mt-0.5 block">{c.email}</span>}
                    </div>
                  </div>
                  <span className="font-heading text-base font-bold text-red-500">{c.number}</span>
                </motion.div>
              )
            })}
          </div>
        </GlowCard>

        {/* Live Location Tracking */}
        <GlowCard hover={false} className="bg-white border border-cyber-border rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-5 text-text-primary flex items-center gap-2.5 uppercase tracking-wider">
            <MapPin size={18} className="text-neon-blue" /> Live Location Tracking
          </h3>
          <div className="rounded-2xl bg-cyber-black border border-cyber-border relative overflow-hidden text-center p-6">
            <div className="absolute top-4 right-4 z-10 bg-white/95 px-3.5 py-1.5 rounded-lg border border-cyber-border flex items-center gap-2 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${locationStatus === 'active' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
              <span className="text-xs text-text-primary font-bold">{locationStatus === 'active' ? 'Live GPS' : locationStatus === 'detecting' ? 'Detecting...' : 'Fallback'}</span>
            </div>
            <div className="py-4">
              <MapPin size={32} className="text-neon-blue mx-auto mb-3" />
              {liveCoords ? (
                <>
                  <p className="text-sm font-bold text-text-primary">Location Detected</p>
                  <div className="mt-3 flex items-center justify-center gap-6">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider">Latitude</p>
                      <p className="text-base font-bold text-neon-blue">{liveCoords.lat.toFixed(4)}</p>
                    </div>
                    <div className="w-px h-8 bg-cyber-border" />
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider">Longitude</p>
                      <p className="text-base font-bold text-neon-blue">{liveCoords.lng.toFixed(4)}</p>
                    </div>
                  </div>
                  {userProfile?.location && (
                    <p className="text-xs text-text-secondary mt-3">Address: {userProfile.location}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-text-primary">Detecting GPS Coordinates...</p>
                  <div className="relative w-8 h-8 mx-auto mt-3">
                    <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
                    <div className="absolute inset-0 rounded-full border-2 border-neon-blue border-t-transparent animate-spin" />
                  </div>
                </>
              )}
            </div>
          </div>
        </GlowCard>
      </div>

      {/* ===== SECTION 3: First-Aid Guidance — Full Width ===== */}
      <GlowCard hover={false} className="bg-white border border-cyber-border rounded-2xl p-6">
        <h3 className="text-sm font-bold mb-5 text-text-primary flex items-center gap-2.5 uppercase tracking-wider">
          <Heart size={18} className="text-neon-purple" /> Instant First-Aid Guidance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {firstAidSteps.map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-cyber-black border border-cyber-border text-left">
              <span className="text-sm font-bold text-neon-blue uppercase tracking-wide">{item.title}</span>
              <ul className="mt-3 space-y-2">
                {item.steps.map((step, idx) => (
                  <li key={idx} className="text-sm text-text-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-neon-blue select-none font-bold mt-0.5">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* Loading overlay */}
      <AnimatePresence>
        {loadingAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-cyber-border p-10 rounded-3xl max-w-md w-full mx-4 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 animate-pulse" />
              <h3 className="font-heading text-lg font-extrabold text-red-500 uppercase tracking-wider mb-3 animate-pulse">Broadcasting Alert</h3>
              <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                Querying satellite GPS coordinates and transmitting emergency payload to cloud response networks.
              </p>
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
              </div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block">Connecting secure tunnel...</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
