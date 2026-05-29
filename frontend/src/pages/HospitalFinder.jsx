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

  // Google Maps Integration Effect
  useEffect(() => {
    if (located && coordinates && window.google) {
      const initMap = async () => {
        // Allow a small tick for the DOM element to mount
        await new Promise(resolve => setTimeout(resolve, 50))
        const mapElement = document.getElementById('google-map')
        if (!mapElement) return

        try {
          // Custom style suited for light-mode presentation
          const mapOptions = {
            center: { lat: coordinates.latitude, lng: coordinates.longitude },
            zoom: 14,
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#F1F5F9' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFFFF' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
              { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#CBD5E1' }] },
              { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#0F4C81' }] },
              { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
              { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#E2E8F0' }] },
              { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#E2E8F0' }] }
            ]
          }

          const map = new window.google.maps.Map(mapElement, mapOptions)

          // 1. Marker for User Location
          new window.google.maps.Marker({
            position: { lat: coordinates.latitude, lng: coordinates.longitude },
            map: map,
            title: "Your Location",
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#0F4C81',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }
          })

          // 2. Offsets for nearby hospitals to display around user
          const offsets = [
            { lat: 0.006, lng: 0.005 },
            { lat: -0.005, lng: -0.008 },
            { lat: 0.007, lng: -0.006 },
            { lat: -0.004, lng: 0.008 }
          ]

          mockHospitals.forEach((h, i) => {
            const hPos = {
              lat: coordinates.latitude + (offsets[i]?.lat || 0),
              lng: coordinates.longitude + (offsets[i]?.lng || 0)
            }

            const isSelected = selectedHospital?.name === h.name

            const marker = new window.google.maps.Marker({
              position: hPos,
              map: map,
              title: h.name,
              icon: {
                path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: isSelected ? 8 : 6,
                fillColor: isSelected ? '#22C55E' : '#14B8A6',
                fillOpacity: 0.95,
                strokeColor: '#ffffff',
                strokeWeight: 1.5,
              }
            })

            const infoContent = `
              <div style="color: #1e293b; font-family: 'Inter', sans-serif; padding: 6px; min-width: 160px; text-align: left;">
                <h4 style="margin: 0 0 4px 0; font-size: 12px; font-weight: 800; color: #0F4C81;">${h.name}</h4>
                <p style="margin: 0; font-size: 10px; font-weight: 600; color: #475569;">${h.type} • ⭐ ${h.rating}</p>
                <p style="margin: 4px 0 0 0; font-size: 10px; color: #22C55E; font-weight: 700;">${h.dist} away (${h.eta})</p>
              </div>
            `

            const infoWindow = new window.google.maps.InfoWindow({
              content: infoContent
            })

            marker.addListener('click', () => {
              infoWindow.open(map, marker)
              setSelectedHospital(h)
            })

            if (isSelected) {
              infoWindow.open(map, marker)
            }
          })
        } catch (err) {
          console.error("Map rendering failed:", err)
        }
      }
      initMap()
    }
  }, [located, coordinates, selectedHospital?.name])

  return (
    <div>
      <PageHeader icon={MapPin} title="Nearby Hospitals" subtitle="Find and navigate to the nearest medical facilities." accentColor="neon-green" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 text-left">
        {/* Map Area */}
        <div className="lg:col-span-3">
          <GlowCard hover={false} glowColor="neon-green" className="w-full">
            <div className="w-full rounded-2xl overflow-hidden bg-white border border-cyber-border" style={{ height: '390px' }}>
              {located ? (
                // Google Maps Canvas
                <div id="google-map" className="w-full h-full"></div>
              ) : (
                // Enable Location prompt with beautiful light slate grid background
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#F8FAFC]"
                     style={{
                       backgroundImage: 'linear-gradient(rgba(15,76,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,76,129,0.03) 1px, transparent 1px)',
                       backgroundSize: '30px 30px',
                     }}>
                  <div className="w-12 h-12 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mb-4">
                    <MapPin size={24} className="text-neon-green animate-bounce" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wider mb-2">Hospital Locator Offline</h3>
                  <p className="text-[11px] text-text-secondary max-w-xs text-center mb-6 leading-relaxed font-medium">
                    MediVerse AI requires GPS satellite synchronization to discover nearest registered medical emergency services in your vicinity.
                  </p>
                  
                  <motion.button onClick={handleLocate} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    disabled={locating}
                    className="px-6 py-3 rounded-xl bg-neon-blue hover:bg-[#0B3A63] text-xs text-white font-bold tracking-wider uppercase cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-sm transition-colors">
                    {locating ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Locate size={14} /></motion.div> Syncing Location...</>
                    ) : (
                      <><Locate size={14} /> Enable GPS Sync</>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </GlowCard>
        </div>

        {/* Hospital list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-heading text-xs font-bold text-text-primary uppercase tracking-wider">Nearby Facilities</h3>
            {located && <span className="text-xs text-neon-green font-semibold">● {mockHospitals.length} active</span>}
          </div>

          {!located && (
            <div className="flex flex-col items-center justify-center h-[390px] text-center border border-dashed border-cyber-border rounded-3xl bg-[#FFFFFF]">
              <MapPin size={32} className="text-text-muted opacity-30 mb-3 animate-pulse" />
              <p className="text-xs text-text-secondary max-w-[180px] leading-relaxed font-semibold">Please enable GPS synchronization to discover local clinics.</p>
            </div>
          )}

          {located && mockHospitals.map((h, i) => (
            <GlowCard key={i} delay={i * 0.08} onClick={() => setSelectedHospital(h)}
              className={`cursor-pointer transition-all border ${selectedHospital?.name === h.name ? '!border-neon-green/50 bg-neon-green/5!' : 'border-cyber-border'}`} glowColor="neon-green">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-sm text-text-primary">{h.name}</h4>
                  <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">{h.type}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-neon-orange font-bold">
                  <Star size={11} fill="currentColor" /> {h.rating}
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-text-secondary mb-3">
                <span className="flex items-center gap-1"><Navigation size={11} className="text-neon-blue" /> {h.dist}</span>
                <span className="flex items-center gap-1"><Clock size={11} className="text-neon-green" /> {h.eta}</span>
                <span className="flex items-center gap-1"><Phone size={11} className="text-neon-purple" /> {h.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-neon-blue/10 text-neon-blue border border-neon-blue/20 font-bold">{h.beds} beds available</span>
                {h.ambulance && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-neon-green/10 text-neon-green border border-neon-green/20 flex items-center gap-1 font-bold">
                    <Ambulance size={10} /> Ambulance
                  </span>
                )}
                <button className="ml-auto text-[10px] text-neon-blue flex items-center gap-0.5 hover:underline cursor-pointer font-bold uppercase tracking-wider">
                  Route <ChevronRight size={10} />
                </button>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  )
}
