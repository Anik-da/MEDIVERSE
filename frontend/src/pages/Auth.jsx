import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Phone, Shield, ArrowRight, HeartPulse, Sparkles, KeyRound, ArrowLeft } from 'lucide-react'
import GlowCard from '../components/GlowCard'

export default function Auth() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(60)

  const { initRecaptcha, sendOtp, verifyOtp, loginGoogle } = useAuth()
  const navigate = useNavigate()
  const confirmationResultRef = useRef(null)
  const recaptchaInitialized = useRef(false)

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval = null
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isOtpSent, timer])

  // Reset error when switching states
  const resetState = () => {
    setError('')
    setOtpCode('')
  }

  // Handle phone submission to dispatch live OTP code
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)

    // Form validation
    let formattedPhone = phoneNumber.trim()
    if (!formattedPhone) {
      setError('Please enter a valid mobile number.')
      setLoading(false)
      return
    }

    // Auto-prefix country code +91 if user did not provide a leading '+' sign
    if (!formattedPhone.startsWith('+')) {
      // Assuming +91 default, user can enter full + country code
      if (formattedPhone.length === 10) {
        formattedPhone = '+91' + formattedPhone
      } else {
        setError('Please include your country code (e.g. +91 99999 88888)')
        setLoading(false)
        return
      }
    }

    try {
      // Instantiate Firebase Invisible Recaptcha target
      const verifier = initRecaptcha('recaptcha-container')
      const result = await sendOtp(formattedPhone, verifier)
      confirmationResultRef.current = result
      setIsOtpSent(true)
      setTimer(60)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to dispatch security code. Please check your number.')
      // Reset captcha
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear()
        } catch (_) {}
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP confirmation
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (otpCode.length !== 6) {
      setError('The security code must be precisely 6 digits.')
      setLoading(false)
      return
    }

    try {
      if (!confirmationResultRef.current) {
        throw new Error('Verification session expired. Please request a new security code.')
      }
      await verifyOtp(confirmationResultRef.current, otpCode)
      navigate('/home')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Incorrect passcode. Please check and retry.')
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOtp = () => {
    if (timer > 0) return
    resetState()
    handleSendOtp()
  }

  // Google Oauth backup portal
  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      await loginGoogle()
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Google identity assertion aborted.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cyber-black relative overflow-hidden px-4">
      {/* Cyber grid background */}
      <div className="cyber-grid" />

      {/* Floating radial glow meshes */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-neon-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />



      <div className="w-full max-w-[460px] relative z-10">
        {/* MediVerse AI brand header */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(255,153,51,0.25)] border border-cyber-border"
          >
            <HeartPulse size={28} className="text-white" />
          </motion.div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold font-heading text-text-primary tracking-wide"
          >
            MEDIVERSE AI
          </motion.h1>
          <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mt-1 font-medium flex items-center gap-1.5">
            <Sparkles size={10} className="text-neon-blue" />
            SECURE MOBILE IDENTITY CORE
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <GlowCard hover={false} glowColor={isOtpSent ? 'neon-purple' : 'neon-blue'} className="p-6 md:p-8">
            <div className="flex border-b border-cyber-border/40 pb-4 mb-6">
              <span className="flex-1 pb-1 text-center text-sm font-semibold tracking-wider text-neon-blue uppercase">
                {isOtpSent ? 'OTP VERIFICATION' : 'SECURE LOG IN'}
              </span>
            </div>

            {/* Error notifications */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl border border-neon-red/20 bg-neon-red/10 text-neon-red text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {!isOtpSent ? (
                // Step 1: Input Mobile Number
                <motion.form
                  key="phone-input-step"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSendOtp}
                  className="space-y-5"
                >
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Access your neural health network via secure one-time passcode verification. Enter your mobile number below.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Mobile Phone Number</label>
                    <div className="relative flex items-center">
                      <Phone size={14} className="absolute left-3.5 text-text-muted" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-cyber-border/40 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-blue/40 focus:bg-white/[0.05] transition-all font-medium"
                      />
                    </div>
                    <span className="text-[9px] text-text-muted">Include country code prefix (e.g. +91 for India).</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    type="submit"
                    className="w-full py-3 rounded-xl font-heading text-xs font-bold tracking-widest text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                  >
                    {loading ? (
                      <span>DISPATCHING OTP CODE...</span>
                    ) : (
                      <>
                        <span>SEND SECURITY OTP</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                // Step 2: Input Verification Code
                <motion.form
                  key="otp-verify-step"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => { setIsOtpSent(false); resetState(); }}
                      className="text-[10px] text-neon-blue hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <ArrowLeft size={12} /> Change number
                    </button>
                    <span className="text-[10px] text-text-muted">OTP sent to: {phoneNumber}</span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    Please key in the 6-digit one-time passcode transmitted to your mobile number to authorize the login handshake.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Security Passcode (6-Digits)</label>
                    <div className="relative flex items-center">
                      <KeyRound size={14} className="absolute left-3.5 text-text-muted" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        pattern="\d{6}"
                        placeholder="e.g. 123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-cyber-border/40 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-purple/40 focus:bg-white/[0.05] transition-all tracking-[0.4em] font-black text-center"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    type="submit"
                    className="w-full py-3 rounded-xl font-heading text-xs font-bold tracking-widest text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all bg-gradient-to-r from-neon-purple to-neon-blue shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                  >
                    {loading ? (
                      <span>VERIFYING CORE...</span>
                    ) : (
                      <>
                        <span>VERIFY & SIGN IN</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </motion.button>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-text-muted">Didn't receive passcode?</span>
                    {timer > 0 ? (
                      <span className="text-text-muted">Resend in {timer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-neon-blue hover:underline cursor-pointer font-bold"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 w-full h-[1px] bg-cyber-border/30" />
              <span className="relative z-10 px-3 bg-cyber-dark text-[9px] uppercase font-bold tracking-widest text-text-muted">OR GOOGLE BRIDGE</span>
            </div>

            {/* Google Authentication Portal fallback */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-white/[0.02] border border-cyber-border/40 hover:bg-white/[0.05] hover:border-cyber-border/60 text-xs text-text-primary font-medium flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="mr-1"><path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.013c1.49 0 2.854.55 3.907 1.455l3.057-3.057C19.102 3.1 16.697 2 13.99 2 8.163 2 3.5 6.663 3.5 12.5S8.163 23 13.99 23c5.383 0 9.877-3.85 9.877-9.5 0-.712-.083-1.4-.217-2.073l-11.41-.142z"/></svg>
              <span>Sign in with Google Account</span>
            </motion.button>
          </GlowCard>
        </motion.div>

        {/* Footer validation and security tags */}
        <div className="flex items-center justify-center gap-2 mt-8 text-[10px] text-text-muted">
          <Shield size={12} className="text-neon-blue" />
          <span>Biometric validation and secure SSL tunneling active</span>
        </div>
      </div>
    </div>
  )
}
