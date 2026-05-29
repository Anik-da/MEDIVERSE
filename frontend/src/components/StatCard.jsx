import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, change, accentColor = '#00D4FF', delay = 0 }) {
  const isPositive = change && !change.startsWith('-')

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="p-4 rounded-2xl border border-cyber-border/30 bg-cyber-dark/50 relative overflow-hidden group hover:border-cyber-border/50 transition-all duration-300"
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: accentColor }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}10`, border: `1px solid ${accentColor}12` }}
          >
            <Icon size={17} style={{ color: accentColor }} />
          </div>
          {change && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${isPositive ? 'bg-neon-green/8 text-neon-green' : 'bg-neon-red/8 text-neon-red'}`}>
              {change}
            </span>
          )}
        </div>
        <p className="text-xl font-bold text-text-primary">{value}</p>
        <p className="text-[11px] text-text-muted mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}
