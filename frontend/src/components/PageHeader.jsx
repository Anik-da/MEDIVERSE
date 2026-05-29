import { motion } from 'framer-motion'

export default function PageHeader({ icon: Icon, title, subtitle, accentColor = 'neon-blue' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl bg-${accentColor}/10 flex items-center justify-center`}>
            <Icon size={22} className={`text-${accentColor}`} />
          </div>
        )}
        <h1 className="font-heading text-2xl font-bold tracking-wide text-text-primary">
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="text-text-secondary text-sm ml-[52px]">{subtitle}</p>
      )}
    </motion.div>
  )
}
