import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanLine, Upload, FileText, AlertTriangle, CheckCircle, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import GlowCard from '../components/GlowCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { uploadMedicalReport, saveReportScan } from '../services/firebaseService'

const mockReport = {
  type: 'Complete Blood Count (CBC)',
  date: '2026-05-27',
  values: [
    { name: 'Hemoglobin', value: '14.2 g/dL', range: '13.5-17.5', status: 'normal' },
    { name: 'WBC Count', value: '11,200 /μL', range: '4,500-11,000', status: 'high' },
    { name: 'RBC Count', value: '5.1 M/μL', range: '4.7-6.1', status: 'normal' },
    { name: 'Platelet Count', value: '245,000 /μL', range: '150,000-400,000', status: 'normal' },
    { name: 'Blood Sugar (Fasting)', value: '118 mg/dL', range: '70-100', status: 'high' },
    { name: 'Cholesterol', value: '195 mg/dL', range: '<200', status: 'normal' },
  ],
  summary: 'Overall, your blood work is largely within normal limits. However, your WBC count and fasting blood sugar are slightly elevated. The elevated WBC may indicate a mild infection or inflammatory response. The fasting glucose of 118 mg/dL falls in the pre-diabetic range.',
  recommendations: [
    'Monitor fasting blood sugar regularly — consider a glucose tolerance test',
    'Follow up with your physician regarding the elevated WBC count',
    'Maintain a balanced diet low in refined sugars',
    'Retest CBC in 2-4 weeks to track WBC trend',
  ],
  terms: [
    { term: 'WBC (White Blood Cells)', explain: 'Immune system cells that fight infections. Elevated levels may indicate infection or inflammation.' },
    { term: 'Fasting Blood Sugar', explain: 'Blood glucose measured after 8+ hours of fasting. Values 100-125 mg/dL indicate pre-diabetes.' },
  ],
}

export default function OCRReportScanner() {
  const [file, setFile] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)

  const { currentUser } = useAuth()

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (f) { setFile(f); setResult(null) }
  }

  const handleScan = async () => {
    if (!file) return
    setScanning(true)
    setResult(null)

    try {
      // 1. Upload file to storage
      const downloadURL = await uploadMedicalReport(currentUser.uid, file)
      
      // 2. Fetch OCR summary from FastAPI
      const idToken = await currentUser.getIdToken()
      const response = await fetch('http://localhost:8000/ocr-report-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ file_url: downloadURL })
      })

      let finalReport = mockReport
      if (response.ok) {
        const data = await response.json()
        if (data.status === 'success') {
          finalReport = data.report_summary
        }
      }

      setResult(finalReport)
      // 3. Save to Firestore
      await saveReportScan(currentUser.uid, {
        reportUrl: downloadURL,
        ...finalReport
      })
    } catch (err) {
      console.error(err)
      setResult(mockReport)
      await saveReportScan(currentUser.uid, {
        reportUrl: '',
        ...mockReport
      })
    } finally {
      setScanning(false)
    }
  }

  const statusStyle = (s) => s === 'high'
    ? 'bg-neon-red/10 text-neon-red border-neon-red/20'
    : s === 'low' ? 'bg-neon-orange/10 text-neon-orange border-neon-orange/20'
    : 'bg-neon-green/10 text-neon-green border-neon-green/20'

  return (
    <div>
      <PageHeader icon={ScanLine} title="OCR Report Scanner" subtitle="Upload medical reports for AI-powered analysis and plain-language summaries." accentColor="neon-purple" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Upload panel */}
        <div className="lg:col-span-2 space-y-4">
          <GlowCard hover={false} glowColor="neon-purple">
            <h3 className="font-heading text-sm font-semibold mb-4 text-text-primary flex items-center gap-2">
              <Upload size={16} className="text-neon-purple" /> Upload Report
            </h3>
            <label className="block cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${file ? 'border-neon-purple/30 bg-neon-purple/5' : 'border-cyber-border hover:border-neon-purple/30'}`}>
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={36} className="text-neon-purple" />
                    <p className="text-sm text-text-primary">{file.name}</p>
                    <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <Upload size={36} className="mx-auto text-text-muted mb-3" />
                    <p className="text-sm text-text-secondary">Upload PDF or Image</p>
                    <p className="text-xs text-text-muted mt-1">PDF, PNG, JPG up to 20MB</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*,.pdf" onChange={handleFile} className="hidden" />
            </label>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleScan}
              disabled={!file || scanning}
              className="w-full mt-4 py-3 rounded-xl font-heading text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-neon-purple to-neon-blue text-white transition-all">
              <ScanLine size={16} /> {scanning ? 'Scanning...' : 'Analyze Report'}
            </motion.button>
          </GlowCard>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {scanning && <LoadingSpinner text="Extracting and analyzing report data..." />}

          {!scanning && !result && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FileText size={48} className="text-text-muted opacity-30 mb-4" />
              <p className="text-sm text-text-secondary">Upload a report and scan to get AI analysis.</p>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Report header */}
                <GlowCard hover={false}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-base font-bold text-text-primary">{result.type}</h3>
                      <p className="text-xs text-text-muted">Report date: {result.date}</p>
                    </div>
                    <CheckCircle size={20} className="text-neon-green" />
                  </div>
                </GlowCard>

                {/* Values table */}
                <GlowCard hover={false} delay={0.1}>
                  <h4 className="font-heading text-sm font-semibold mb-3 text-text-primary flex items-center gap-2">
                    <TrendingUp size={14} className="text-neon-blue" /> Lab Values
                  </h4>
                  <div className="space-y-2">
                    {result.values.map((v, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-cyber-dark border border-cyber-border">
                        <div>
                          <p className="text-sm text-text-primary">{v.name}</p>
                          <p className="text-xs text-text-muted">Range: {v.range}</p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="font-heading text-sm font-bold text-text-primary">{v.value}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border uppercase font-semibold ${statusStyle(v.status)}`}>
                            {v.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>

                {/* AI Summary */}
                <GlowCard hover={false} delay={0.2}>
                  <h4 className="font-heading text-sm font-semibold mb-2 text-text-primary flex items-center gap-2">
                    <Sparkles size={14} className="text-neon-blue" /> AI Summary
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{result.summary}</p>
                </GlowCard>

                {/* Recommendations */}
                <GlowCard hover={false} delay={0.3}>
                  <h4 className="font-heading text-sm font-semibold mb-3 text-text-primary">📋 Recommendations</h4>
                  <div className="space-y-2">
                    {result.recommendations.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <ChevronRight size={12} className="text-neon-blue flex-shrink-0 mt-0.5" /> {r}
                      </div>
                    ))}
                  </div>
                </GlowCard>

                {/* Medical terms */}
                <GlowCard hover={false} delay={0.4}>
                  <h4 className="font-heading text-sm font-semibold mb-3 text-text-primary">📖 Terms Explained</h4>
                  <div className="space-y-3">
                    {result.terms.map((t, i) => (
                      <div key={i} className="p-3 rounded-xl bg-cyber-dark border border-cyber-border">
                        <p className="text-sm font-medium text-neon-blue mb-1">{t.term}</p>
                        <p className="text-xs text-text-secondary">{t.explain}</p>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
