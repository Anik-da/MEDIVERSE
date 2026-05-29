import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pill, Camera, Upload, Scan, AlertCircle, Clock, ShieldCheck, ChevronRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import GlowCard from '../components/GlowCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { uploadMedicineImage, saveMedicineScan } from '../services/firebaseService'

const mockResult = {
  name: 'Paracetamol 500mg',
  brand: 'Calpol',
  type: 'Analgesic / Antipyretic',
  dosage: '1-2 tablets every 4-6 hours. Max 8 tablets/day.',
  usage: ['Fever reduction', 'Mild to moderate pain relief', 'Headache', 'Body aches'],
  sideEffects: ['Nausea (rare)', 'Liver damage (overdose)', 'Allergic skin reaction (rare)'],
  warnings: ['Do not exceed recommended dose', 'Avoid with alcohol', 'Consult doctor if pregnant'],
  expiry: '2027-03-15',
  isExpired: false,
}

export default function MedicineScanner() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)

  const { currentUser } = useAuth()

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setResult(null)
    }
  }

  const handleScan = async () => {
    if (!file) return
    setScanning(true)
    setResult(null)
    
    try {
      // 1. Upload file to storage
      const downloadURL = await uploadMedicineImage(currentUser.uid, file)
      
      // 2. Fetch OCR & description from FastAPI
      const idToken = await currentUser.getIdToken()
      const response = await fetch('http://localhost:8000/medicine-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ image_url: downloadURL })
      })

      let finalResult = mockResult
      if (response.ok) {
        const data = await response.json()
        if (data.status === 'success') {
          finalResult = data.medicine_details
        }
      }

      setResult(finalResult)
      // 3. Save to Firestore
      await saveMedicineScan(currentUser.uid, {
        imageUrl: downloadURL,
        ...finalResult
      })
    } catch (err) {
      console.error(err)
      setResult(mockResult)
      await saveMedicineScan(currentUser.uid, {
        imageUrl: preview || '',
        ...mockResult
      })
    } finally {
      setScanning(false)
    }
  }

  return (
    <div>
      <PageHeader icon={Pill} title="Medicine Scanner" subtitle="Scan medicine packages to identify drugs, dosage, and safety info." accentColor="neon-purple" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload panel */}
        <div className="space-y-4">
          <GlowCard hover={false} glowColor="neon-purple">
            <h3 className="font-heading text-sm font-semibold mb-4 text-text-primary flex items-center gap-2">
              <Camera size={16} className="text-neon-purple" /> Upload Medicine Image
            </h3>

            <label className="block w-full cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${preview ? 'border-neon-purple/30' : 'border-cyber-border hover:border-neon-purple/30'}`}>
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                    {scanning && (
                      <motion.div className="absolute inset-0 rounded-lg overflow-hidden">
                        <motion.div animate={{ top: ['-5%', '105%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="absolute left-0 right-0 h-0.5 bg-neon-purple"
                          style={{ boxShadow: '0 0 15px #A855F7, 0 0 30px #A855F7' }} />
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div>
                    <Upload size={36} className="mx-auto text-text-muted mb-3" />
                    <p className="text-sm text-text-secondary">Click to upload or drag & drop</p>
                    <p className="text-xs text-text-muted mt-1">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleScan}
              disabled={!file || scanning}
              className="w-full mt-4 py-3 rounded-xl font-heading text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-neon-purple to-neon-pink text-white transition-all">
              <Scan size={16} /> {scanning ? 'Scanning...' : 'Scan Medicine'}
            </motion.button>
          </GlowCard>
        </div>

        {/* Results panel */}
        <div>
          {scanning && <LoadingSpinner text="Analyzing medicine package..." />}

          {!scanning && !result && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Pill size={48} className="text-text-muted opacity-30 mb-4" />
              <p className="text-sm text-text-secondary">Upload a medicine image and scan to get details.</p>
            </div>
          )}

          <AnimatePresence>
            {result && !scanning && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <GlowCard hover={false} glowColor="neon-purple">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-text-primary">{result.name}</h3>
                      <p className="text-xs text-text-secondary">{result.brand} — {result.type}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${result.isExpired ? 'bg-neon-red/10 text-neon-red border border-neon-red/20' : 'bg-neon-green/10 text-neon-green border border-neon-green/20'}`}>
                      {result.isExpired ? 'EXPIRED' : 'VALID'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Clock size={12} className="text-neon-blue" /> Expiry: {result.expiry}
                  </div>
                </GlowCard>

                <GlowCard hover={false} delay={0.1}>
                  <h4 className="font-semibold text-sm mb-2 text-text-primary">💊 Dosage</h4>
                  <p className="text-sm text-text-secondary">{result.dosage}</p>
                </GlowCard>

                <GlowCard hover={false} delay={0.2}>
                  <h4 className="font-semibold text-sm mb-2 text-text-primary">✅ Usage</h4>
                  <div className="space-y-1.5">
                    {result.usage.map((u, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                        <ShieldCheck size={12} className="text-neon-green" /> {u}
                      </div>
                    ))}
                  </div>
                </GlowCard>

                <GlowCard hover={false} delay={0.3}>
                  <h4 className="font-semibold text-sm mb-2 text-text-primary">⚠️ Side Effects</h4>
                  <div className="space-y-1.5">
                    {result.sideEffects.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                        <ChevronRight size={12} className="text-neon-orange" /> {s}
                      </div>
                    ))}
                  </div>
                </GlowCard>

                <div className="glass-panel p-4 border-neon-orange/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={16} className="text-neon-orange flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-text-secondary space-y-1">
                      {result.warnings.map((w, i) => <p key={i}>{w}</p>)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
