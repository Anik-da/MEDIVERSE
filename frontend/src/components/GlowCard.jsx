import { motion } from 'framer-motion'

const glowColorMap = {
  'neon-blue': {
    accent: 'from-transparent via-[#00D4FF]/60 to-transparent',
    shadow: 'group-hover:shadow-[0_0_25px_rgba(0,212,255,0.18)]',
    border: 'group-hover:border-[#00D4FF]/30'
  },
  'neon-purple': {
    accent: 'from-transparent via-[#8B5CF6]/60 to-transparent',
    shadow: 'group-hover:shadow-[0_0_25px_rgba(139,92,246,0.18)]',
    border: 'group-hover:border-[#8B5CF6]/30'
  },
  'neon-pink': {
    accent: 'from-transparent via-[#EC4899]/60 to-transparent',
    shadow: 'group-hover:shadow-[0_0_25px_rgba(236,72,153,0.18)]',
    border: 'group-hover:border-[#EC4899]/30'
  },
  'neon-green': {
    accent: 'from-transparent via-[#10B981]/60 to-transparent',
    shadow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.18)]',
    border: 'group-hover:border-[#10B981]/30'
  },
  'neon-red': {
    accent: 'from-transparent via-[#EF4444]/60 to-transparent',
    shadow: 'group-hover:shadow-[0_0_25px_rgba(239,68,68,0.18)]',
    border: 'group-hover:border-[#EF4444]/30'
  }
}

export default function GlowCard({
  children,
  className = '',
  glowColor = 'neon-blue',
  delay = 0,
  hover = true,
  onClick,
  variant = 'default', // 'default' | 'elevated' | 'outlined'
}) {
  const glow = glowColorMap[glowColor] || glowColorMap['neon-blue']
  
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
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`
        ${baseClass} p-5 relative overflow-hidden group
        ${hover ? 'cursor-pointer' : ''}
        ${glow.shadow} ${glow.border}
        transition-all duration-300
        ${className}
      `}
    >
      {/* Subtle shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none shimmer-bg" />

      {/* Top glowing accent line */}
      <div
        className={`
          absolute top-0 left-[10%] right-[10%] h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500
          bg-gradient-to-r ${glow.accent}
        `}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
