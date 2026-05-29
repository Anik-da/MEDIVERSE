import { motion } from 'framer-motion'
import { Activity, HeartPulse, TrendingUp, Pill, AlertTriangle, Sparkles, Droplets, Moon, Flame, Footprints } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import GlowCard from '../components/GlowCard'
import StatCard from '../components/StatCard'

const weeklyData = [65, 72, 58, 80, 75, 88, 82]
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const medicines = [
  { name: 'Vitamin D3', time: '8:00 AM', taken: true },
  { name: 'Omega-3', time: '1:00 PM', taken: true },
  { name: 'Melatonin', time: '10:00 PM', taken: false },
]

const alerts = [
  { text: 'Blood sugar slightly elevated — monitor closely', severity: 'warning', color: '#FF6B35' },
  { text: 'Next checkup due in 3 days', severity: 'info', color: '#00F0FF' },
]

const recommendations = [
  { icon: Droplets, text: 'Increase water intake to 3L/day', color: '#00F0FF' },
  { icon: Moon, text: 'Aim for 7-8 hours of sleep tonight', color: '#A855F7' },
  { icon: Flame, text: 'Add 20 min cardio to your routine', color: '#FF3366' },
  { icon: Footprints, text: 'You need 2,400 more steps today', color: '#00FF88' },
]

const history = [
  { date: 'May 25', event: 'Annual Health Checkup', status: 'Completed', color: '#00FF88' },
  { date: 'May 18', event: 'Blood Test — CBC Panel', status: 'Normal', color: '#00F0FF' },
  { date: 'May 10', event: 'Dental Cleaning', status: 'Completed', color: '#A855F7' },
  { date: 'Apr 28', event: 'Eye Examination', status: 'Follow-up', color: '#FF6B35' },
]

export default function HealthDashboard() {
  const maxVal = Math.max(...weeklyData)

  return (
    <div>
      <PageHeader icon={Activity} title="Health Dashboard" subtitle="Your comprehensive health analytics and insights." />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={HeartPulse} label="Heart Rate" value="72 bpm" change="-2%" accentColor="#FF3366" delay={0} />
        <StatCard icon={Droplets} label="Blood Oxygen" value="98%" change="+1%" accentColor="#00F0FF" delay={0.1} />
        <StatCard icon={Flame} label="Calories Burned" value="1,847" change="+12%" accentColor="#FF6B35" delay={0.2} />
        <StatCard icon={Footprints} label="Steps Today" value="7,623" change="+8%" accentColor="#00FF88" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly health score chart */}
        <div className="lg:col-span-2">
          <GlowCard hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-semibold text-text-primary flex items-center gap-2">
                <TrendingUp size={16} className="text-neon-blue" /> Weekly Health Score
              </h3>
              <span className="text-xs text-text-muted">This Week</span>
            </div>
            <div className="flex items-end justify-between gap-3 h-40">
              {weeklyData.map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs text-text-muted">{val}</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(val / maxVal) * 100}%` }}
                    transition={{ delay: i * 0.08, duration: 0.6, ease: 'easeOut' }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-neon-blue/60 to-neon-purple/60 relative min-h-[8px]"
                    style={{ boxShadow: '0 0 8px rgba(0,240,255,0.15)' }}>
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-neon-blue rounded-full" />
                  </motion.div>
                  <span className="text-xs text-text-secondary">{days[i]}</span>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* Medicine reminders */}
        <GlowCard hover={false}>
          <h3 className="font-heading text-sm font-semibold mb-3 text-text-primary flex items-center gap-2">
            <Pill size={16} className="text-neon-purple" /> Medicine Reminders
          </h3>
          <div className="space-y-3">
            {medicines.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-cyber-dark border border-cyber-border">
                <div>
                  <p className="text-sm text-text-primary">{m.name}</p>
                  <p className="text-xs text-text-muted">{m.time}</p>
                </div>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${m.taken ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'bg-cyber-dark border border-cyber-border text-text-muted'}`}>
                  {m.taken ? '✓' : '○'}
                </div>
              </motion.div>
            ))}
          </div>
        </GlowCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Recommendations */}
        <div className="lg:col-span-1">
          <GlowCard hover={false}>
            <h3 className="font-heading text-sm font-semibold mb-3 text-text-primary flex items-center gap-2">
              <Sparkles size={16} className="text-neon-blue" /> AI Recommendations
            </h3>
            <div className="space-y-2.5">
              {recommendations.map((r, i) => {
                const Icon = r.icon
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                    <Icon size={16} className="flex-shrink-0 mt-0.5" style={{ color: r.color }} />
                    <p className="text-xs text-text-secondary leading-relaxed">{r.text}</p>
                  </motion.div>
                )
              })}
            </div>
          </GlowCard>
        </div>

        {/* Alerts */}
        <div className="lg:col-span-1">
          <GlowCard hover={false}>
            <h3 className="font-heading text-sm font-semibold mb-3 text-text-primary flex items-center gap-2">
              <AlertTriangle size={16} className="text-neon-orange" /> Alerts
            </h3>
            <div className="space-y-2.5">
              {alerts.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}
                  className="p-3 rounded-xl border" style={{ borderColor: `${a.color}30`, backgroundColor: `${a.color}08` }}>
                  <p className="text-xs" style={{ color: a.color }}>{a.text}</p>
                </motion.div>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* Disease History Timeline */}
        <div className="lg:col-span-1">
          <GlowCard hover={false}>
            <h3 className="font-heading text-sm font-semibold mb-3 text-text-primary">Health History</h3>
            <div className="space-y-3 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-cyber-border" />
              {history.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 pl-1 relative">
                  <div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 z-10 bg-cyber-black" style={{ borderColor: h.color }} />
                  <div>
                    <p className="text-xs text-text-muted">{h.date}</p>
                    <p className="text-sm text-text-primary">{h.event}</p>
                    <span className="text-xs" style={{ color: h.color }}>{h.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  )
}
