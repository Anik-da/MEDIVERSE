import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 'md', text = 'Processing...' }) {
  const sizeMap = { sm: 32, md: 48, lg: 64 }
  const s = sizeMap[size] || 48

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative" style={{ width: s, height: s }}>
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: '#00F0FF',
            borderRightColor: 'rgba(0,240,255,0.3)',
          }}
        />
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full border-2 border-transparent"
          style={{
            inset: '6px',
            borderBottomColor: '#A855F7',
            borderLeftColor: 'rgba(168,85,247,0.3)',
          }}
        />
        {/* Center dot */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-blue"
          style={{ boxShadow: '0 0 10px #00F0FF' }}
        />
      </div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm text-text-secondary font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}
