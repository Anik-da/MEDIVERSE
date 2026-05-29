import { motion } from 'framer-motion'
import {
  HeartPulse,
  FileText,
  Activity,
  ShieldAlert,
  Clock,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import GlowCard from '../components/GlowCard'

const healthCards = [
  { label: 'Health Score', value: '85 / 100', desc: 'Excellent physical marks', color: '#0F4C81', icon: HeartPulse },
  { label: 'Reports Scan', value: '12 Analyzed', desc: 'Blood panels, OCR reports', color: '#14B8A6', icon: FileText },
  { label: 'Disease Predictions', value: '8 Mapped', desc: 'Cardiac, diabetic indices', color: '#FF9933', icon: Activity },
  { label: 'Emergency Status', value: 'System Active', desc: 'Ambulance tracking live', color: '#22C55E', icon: ShieldAlert },
]

const recentActivity = [
  { time: '10 mins ago', text: 'Scanned Vitamin D3 supplement expiration', color: '#FF9933' },
  { time: '2 hours ago', text: 'Logged symptoms: mild dry cough', color: '#0F4C81' },
  { time: 'Yesterday', text: 'OCR simplified Apollo Labs Blood Report', color: '#14B8A6' },
  { time: '3 days ago', text: 'Updated secondary emergency numbers', color: '#22C55E' },
]

const medicines = [
  { name: 'Vitamin D3 (Calcirol)', time: '8:00 AM', taken: true },
  { name: 'Omega-3 (Fish Oil)', time: '1:00 PM', taken: true },
  { name: 'Pantocid (Antacid)', time: '9:00 PM', taken: false },
]

const appointments = [
  { doctor: 'Dr. Ramesh Kumar', specialty: 'Cardiologist (Apollo)', time: 'Tomorrow, 10:30 AM' },
  { doctor: 'Dr. Priya Sharma', specialty: 'Mental Wellness AI Support', time: 'Monday, 4:00 PM' },
]

const nearbyHospitals = [
  { name: 'Apollo Critical Care Hospital', distance: '1.2 km', rating: '4.8 ⭐' },
  { name: 'Max Super Speciality Clinic', distance: '2.5 km', rating: '4.6 ⭐' },
]

const chartData = [75, 78, 82, 80, 85, 88, 85]
const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function HealthDashboard() {
  const maxScore = Math.max(...chartData)

  return (
    <div className="space-y-6">
      <PageHeader
        icon={HeartPulse}
        title="Health Dashboard"
        subtitle="Manage your physiological indicators, OCR report summaries, and emergency status in real-time."
      />

      {/* ─── TOP ROW: 4 FIXED HEALTH CARDS ─────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthCards.map((c, i) => {
          const Icon = c.icon
          return (
            <GlowCard hover={false} key={i} className="bg-white border border-cyber-border p-6 rounded-3xl flex flex-col justify-between h-36">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">{c.label}</span>
                <div className="p-2.5 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${c.color}08`, border: `1px solid ${c.color}15` }}>
                  <Icon size={18} style={{ color: c.color }} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black font-heading text-text-primary mt-2">{c.value}</p>
                <p className="text-[10px] text-text-muted mt-1 leading-none">{c.desc}</p>
              </div>
            </GlowCard>
          )
        })}
      </div>

      {/* ─── SECOND ROW: HEALTH ANALYTICS CHART & RECENT ACTIVITY ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Health Analytics Chart */}
        <div className="lg:col-span-8">
          <GlowCard hover={false} className="bg-white border border-cyber-border p-6 h-96 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-neon-blue" />
                <h3 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wide">Physiological Health Index</h3>
              </div>
              <span className="text-[10px] bg-neon-blue/5 text-neon-blue border border-neon-blue/15 px-3 py-1 rounded-full font-bold">This Week</span>
            </div>
            
            {/* Smooth bar graph with accurate height calculations */}
            <div className="flex-1 flex items-end justify-between gap-4 h-48 px-2">
              {chartData.map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-2.5 flex-1">
                  <span className="text-[10px] text-text-secondary font-bold">{val}%</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / maxScore) * 120}px` }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-neon-blue to-neon-purple relative min-h-[6px]"
                  />
                  <span className="text-[11px] text-text-muted font-medium">{chartDays[i]}</span>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-4">
          <GlowCard hover={false} className="bg-white border border-cyber-border p-6 h-96 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clock size={18} className="text-neon-purple" />
                <h3 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wide">Recent Activity</h3>
              </div>

              <div className="space-y-4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex gap-3 text-left">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: a.color }} />
                    <div>
                      <p className="text-xs text-text-primary font-medium leading-relaxed">{a.text}</p>
                      <span className="text-[9px] text-text-muted mt-0.5 block">{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlowCard>
        </div>
      </div>

      {/* ─── THIRD ROW: MEDICINE, APPOINTMENTS, HOSPITALS ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medicine Reminders Widget */}
        <GlowCard hover={false} className="bg-white border border-cyber-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <HeartPulse size={18} className="text-neon-pink" />
            <h3 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wide">Medicine Reminders</h3>
          </div>
          <div className="space-y-3">
            {medicines.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-cyber-black border border-cyber-border">
                <div>
                  <p className="text-xs font-bold text-text-primary">{m.name}</p>
                  <p className="text-[10px] text-text-muted">{m.time}</p>
                </div>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${m.taken ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white border border-cyber-border text-text-muted'}`}>
                  {m.taken ? '✓' : '○'}
                </div>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Upcoming Appointments Widget */}
        <GlowCard hover={false} className="bg-white border border-cyber-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-neon-blue" />
            <h3 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wide">Appointments</h3>
          </div>
          <div className="space-y-3">
            {appointments.map((ap, i) => (
              <div key={i} className="p-3 rounded-xl bg-cyber-black border border-cyber-border text-left">
                <p className="text-xs font-bold text-text-primary">{ap.doctor}</p>
                <p className="text-[10px] text-neon-blue mt-0.5">{ap.specialty}</p>
                <p className="text-[9px] text-text-muted mt-1 flex items-center gap-1.5">
                  <Clock size={10} /> {ap.time}
                </p>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Nearby Hospitals Widget */}
        <GlowCard hover={false} className="bg-white border border-cyber-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-neon-purple" />
            <h3 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wide">Nearby Hospitals</h3>
          </div>
          <div className="space-y-3">
            {nearbyHospitals.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-cyber-black border border-cyber-border text-left">
                <div>
                  <p className="text-xs font-bold text-text-primary">{h.name}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{h.distance} away</p>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold">{h.rating}</span>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>
    </div>
  )
}
