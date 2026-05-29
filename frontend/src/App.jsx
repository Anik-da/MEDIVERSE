import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Home from './pages/Home'
import SymptomChecker from './pages/SymptomChecker'
import EmergencyAssistance from './pages/EmergencyAssistance'
import HospitalFinder from './pages/HospitalFinder'
import MedicineScanner from './pages/MedicineScanner'
import MentalHealthChat from './pages/MentalHealthChat'
import HealthDashboard from './pages/HealthDashboard'
import VoiceDiagnosis from './pages/VoiceDiagnosis'
import OCRReportScanner from './pages/OCRReportScanner'
import UserProfile from './pages/UserProfile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Landing & Auth pages — no sidebar/navbar */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />

      {/* App pages — securely protected */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/emergency" element={<EmergencyAssistance />} />
        <Route path="/hospitals" element={<HospitalFinder />} />
        <Route path="/medicine-scanner" element={<MedicineScanner />} />
        <Route path="/mental-health" element={<MentalHealthChat />} />
        <Route path="/dashboard" element={<HealthDashboard />} />
        <Route path="/voice-diagnosis" element={<VoiceDiagnosis />} />
        <Route path="/ocr-scanner" element={<OCRReportScanner />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}

export default App
