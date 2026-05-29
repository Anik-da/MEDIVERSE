import { useState, useEffect } from 'react'
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

  // Auto-locate on mount
  useEffect(() => {
    handleLocate()
  }, [])

  // Build the Google Maps embed iframe URL (requires no API key, handles live GPS sync & hospital select)
  const getMapUrl = () => {
    if (!coordinates) return ''
    let lat = coordinates.latitude
    let lng = coordinates.longitude

    if (selectedHospital) {
      const hospitalIdx = mockHospitals.findIndex(h => h.name === selectedHospital.name)
      const offsets = [
        { lat: 0.006, lng: 0.005 },
        { lat: -0.005, lng: -0.008 },
        { lat: 0.007, lng: -0.006 },
        { lat: -0.004, lng: 0.008 }
      ]
      const offset = offsets[hospitalIdx] || { lat: 0, lng: 0 }
      lat += offset.lat
      lng += offset.lng
      
      return `https://maps.google.com/maps?q=${lat},${lng}(${encodeURIComponent(selectedHospital.name)})&z=15&output=embed`
    }

    return `https://maps.google.com/maps?q=${lat},${lng}(Your%20Location)&z=14&output=embed`
  }



  return (
    <div className="space-y-8">
      <PageHeader icon={MapPin} title="Nearby Hospitals" subtitle="Find and navigate to the nearest medical facilities." accentColor="neon-green" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 text-left">
        {/* Map Area */}
        <div className="lg:col-span-3">
          <GlowCard hover={false} glowColor="neon-green" className="bg-white border border-cyber-border rounded-xl !p-0 overflow-hidden">
            <div className="w-full rounded-xl overflow-hidden" style={{ height: '450px' }}>
              {located && coordinates ? (
                <iframe
                  title="Location Map"
                  src={getMapUrl()}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-50"
                     style={{
                       backgroundImage: 'linear-gradient(rgba(15,76,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,76,129,0.03) 1px, transparent 1px)',
                       backgroundSize: '30px 30px',
                     }}>
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                    <MapPin size={28} className="text-emerald-500 animate-bounce" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider mb-2">Hospital Locator</h3>
                  <p className="text-sm text-slate-500 max-w-xs text-center mb-6 leading-relaxed">
                    MediVerse AI requires GPS to discover nearest medical facilities in your area.
                  </p>
                  
                  <motion.button onClick={handleLocate} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    disabled={locating}
                    className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold tracking-wider uppercase cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-md transition-colors">
                    {locating ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Locate size={16} /></motion.div> Syncing...</>
                    ) : (
                      <><Locate size={16} /> Enable GPS</>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </GlowCard>

          {/* Coordinates display */}
          {located && coordinates && (
            <div className="mt-4 flex items-center gap-6 px-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-slate-500 font-medium">Live GPS Active</span>
              </div>
              <span className="text-sm text-slate-400">Lat: <strong className="text-slate-700">{coordinates.latitude.toFixed(4)}</strong></span>
              <span className="text-sm text-slate-400">Lng: <strong className="text-slate-700">{coordinates.longitude.toFixed(4)}</strong></span>
            </div>
          )}
        </div>

        {/* Hospital list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">Nearby Facilities</h3>
            {located && <span className="text-sm text-emerald-500 font-semibold">● {mockHospitals.length} active</span>}
          </div>

          {!located && (
            <div className="flex flex-col items-center justify-center h-[420px] text-center border border-dashed border-slate-200 rounded-xl bg-white">
              <MapPin size={36} className="text-slate-300 mb-4 animate-pulse" />
              <p className="text-sm text-slate-400 max-w-[200px] leading-relaxed font-medium">Enable GPS to discover nearby hospitals.</p>
            </div>
          )}

          {located && mockHospitals.map((h, i) => (
            <GlowCard key={i} delay={i * 0.08} onClick={() => setSelectedHospital(h)}
              className={`cursor-pointer transition-all border rounded-xl ${selectedHospital?.name === h.name ? '!border-emerald-500/50 !bg-emerald-50/50' : 'border-cyber-border'}`} glowColor="neon-green">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-base text-slate-800">{h.name}</h4>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{h.type}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-amber-500 font-bold">
                  <Star size={14} fill="currentColor" /> {h.rating}
                </div>
              </div>
              <div className="flex items-center gap-5 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1.5"><Navigation size={13} className="text-blue-500" /> {h.dist}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} className="text-emerald-500" /> {h.eta}</span>
                <span className="flex items-center gap-1.5"><Phone size={13} className="text-purple-500" /> {h.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 font-bold">{h.beds} beds available</span>
                {h.ambulance && (
                  <span className="text-xs px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1.5 font-bold">
                    <Ambulance size={12} /> Ambulance
                  </span>
                )}
                <button className="ml-auto text-xs text-blue-500 flex items-center gap-1 hover:underline cursor-pointer font-bold uppercase tracking-wider">
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
