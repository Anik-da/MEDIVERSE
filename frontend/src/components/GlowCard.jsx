import { motion } from 'framer-motion'

export default function GlowCard({
  children,
  className = '',
  glowColor = 'neon-blue',
  delay = 0,
  hover = true,
  onClick,
  variant = 'default', // 'default' | 'elevated' | 'outlined'
}) {
  const baseClass = variant === 'elevated'
    ? 'card-elevated'
    : variant === 'outlined'
      ? 'border border-cyber-border bg-transparent'
      : 'glass-panel'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`
        ${baseClass} p-5 relative overflow-hidden group
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Subtle shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none shimmer-bg" />

      {/* Top accent line */}
      <div
        className={`
          absolute top-0 left-[10%] right-[10%] h-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500
          bg-gradient-to-r from-transparent via-${glowColor}/40 to-transparent
        `}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
