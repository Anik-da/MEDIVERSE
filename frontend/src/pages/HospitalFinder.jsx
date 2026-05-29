import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Clock, Phone, Star, ChevronRight, Locate, Ambulance } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import GlowCard from '../components/GlowCard'

const mockHospitals = [
  { name: 'Apollo Multispecialty Hospital', dist: '1.2 km', eta: '5 min', rating: 4.8, beds: 12, ambulance: true, type: 'Multispecialty', phone: '+91 98765 43210' },
  { name: 'City Care Emergency Center', dist: '2.5 km', eta: '9 min', rating: 4.5, beds: 8, ambulance: true, type: 'Emergency', phone: '+91 98765 43211' },
  { name: 'MedLife General Hospital', dist: '3.8 km', eta: '14 min', rating: 4.3, beds: 25, ambulance: false, type: 'General', phone: '+91 98765 43212' },
  { name: 'NeuroVerse Specialty Clinic', dist: '5.1 km', eta: '18 min', rating: 4.9, beds: 6, ambulance: true, type: 'Neurology', phone: '+91 98765 43213' },
]

export default function HospitalFinder() {
  const [locating, setLocating] = useState(false)
  const [located, setLocated] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [coordinates, setCoordinates] = useState(null)
  const [error, setError] = useState(null)

  const handleLocate = () => {
    setLocating(true)
    setError(null)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          setLocating(false)
          setLocated(true)
        },
        (err) => {
          console.warn("Geolocation permission or network error. Using secure grid coordinates.", err)
          setError("Using simulated coordinates due to browser permissions.")
          // Failover gracefully
          setCoordinates({ latitude: 22.5726, longitude: 88.3639 })
          setLocating(false)
          setLocated(true)
        },
        { enableHighAccuracy: true, timeout: 5000 }
      )
    } else {
      setError("Browser does not support geolocation. Using fallback.")
      setCoordinates({ latitude: 22.5726, longitude: 88.3639 })
      setLocating(false)
      setLocated(true)
    }
  }

  return (
    <div>
      <PageHeader icon={MapPin} title="Nearby Hospitals" subtitle="Find and navigate to the nearest medical facilities." accentColor="neon-green" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-3">
          <GlowCard hover={false} glowColor="neon-green" className="h-full min-h-[400px] relative">
            {/* Simulated map */}
            <div className="absolute inset-6 rounded-xl overflow-hidden bg-cyber-dark border border-cyber-border">
              <div className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}>
                {/* User location dot */}
                {located && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div animate={{ scale: [1, 2], opacity: [0.4, 0] }} transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-blue" />
                    <div className="w-4 h-4 rounded-full bg-neon-blue border-2 border-white relative z-10"
                      style={{ boxShadow: '0 0 15px #00F0FF' }} />
                  </motion.div>
                )}
                {/* Hospital markers */}
                {located && mockHospitals.map((h, i) => {
                  const positions = [
                    { top: '30%', left: '60%' }, { top: '55%', left: '35%' },
                    { top: '25%', left: '25%' }, { top: '70%', left: '65%' },
                  ]
                  return (
                    <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.15 }}
                      onClick={() => setSelectedHospital(h)}
                      className="absolute cursor-pointer group" style={positions[i]}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${selectedHospital?.name === h.name ? 'bg-neon-green scale-125' : 'bg-neon-purple/80 hover:bg-neon-green'}`}
                        style={{ boxShadow: '0 0 10px rgba(168,85,247,0.4)' }}>
                        <MapPin size={16} className="text-white" />
                      </div>
                    </motion.div>
                  )
                })}
                {/* Center prompt */}
                {!located && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button onClick={handleLocate} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      disabled={locating}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-green/20 to-neon-blue/20 border border-neon-green/30 text-sm text-neon-green font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50">
                      {locating ? (
                        <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Locate size={18} /></motion.div> Locating...</>
                      ) : (
                        <><Locate size={18} /> Enable GPS Location</>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </GlowCard>
        </div>

        {/* Hospital list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-heading text-sm font-semibold text-text-primary">Nearby Facilities</h3>
            {located && <span className="text-xs text-neon-green">● {mockHospitals.length} found</span>}
          </div>

          {!located && (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <MapPin size={36} className="text-text-muted opacity-30 mb-3" />
              <p className="text-sm text-text-secondary">Enable location to find hospitals</p>
            </div>
          )}

          {located && mockHospitals.map((h, i) => (
            <GlowCard key={i} delay={i * 0.1} onClick={() => setSelectedHospital(h)}
              className={`${selectedHospital?.name === h.name ? '!border-neon-green/40' : ''}`} glowColor="neon-green">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm text-text-primary">{h.name}</h4>
                  <span className="text-xs text-text-muted">{h.type}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-neon-orange">
                  <Star size={12} fill="currentColor" /> {h.rating}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
                <span className="flex items-center gap-1"><Navigation size={12} className="text-neon-blue" /> {h.dist}</span>
                <span className="flex items-center gap-1"><Clock size={12} className="text-neon-green" /> {h.eta}</span>
                <span className="flex items-center gap-1"><Phone size={12} className="text-neon-purple" /> {h.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-md bg-neon-blue/10 text-neon-blue border border-neon-blue/20">{h.beds} beds</span>
                {h.ambulance && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-neon-green/10 text-neon-green border border-neon-green/20 flex items-center gap-1">
                    <Ambulance size={10} /> Available
                  </span>
                )}
                <button className="ml-auto text-xs text-neon-blue flex items-center gap-0.5 hover:underline cursor-pointer">
                  Route <ChevronRight size={12} />
                </button>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  )
}
