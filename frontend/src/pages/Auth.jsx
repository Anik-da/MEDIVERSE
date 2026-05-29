import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  Phone, Shield, ArrowRight, HeartPulse, Sparkles, KeyRound, ArrowLeft, 
  User, Mail, MapPin, AlertCircle, CheckCircle2 
} from 'lucide-react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import GlowCard from '../components/GlowCard'

export default function Auth() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(60)

  // Onboarding registration state variables
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [tempUser, setTempUser] = useState(null)
  const [onboardName, setOnboardName] = useState('')
  const [onboardEmail, setOnboardEmail] = useState('')
  const [onboardEmergencyNumber, setOnboardEmergencyNumber] = useState('')
  const [onboardEmergencyEmail, setOnboardEmergencyEmail] = useState('')
  const [onboardLocation, setOnboardLocation] = useState('')

  const { initRecaptcha, sendOtp, verifyOtp, loginGoogle, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const confirmationResultRef = useRef(null)

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

  // Check if user has complete profile in Firestore
  const checkUserProfileAndProceed = async (user) => {
    try {
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        // If they already filled out their name and emergency contacts, they are fully registered!
        if (data.name && data.emergencyNumber && data.emergencyEmail) {
          navigate('/home')
          return
        }
      }
      
      // Direct user to Onboarding Profile complete screen
      setTempUser(user)
      setIsOnboarding(true)
    } catch (err) {
      console.error("Profile check error:", err)
      setError("Successfully signed in, but failed to synchronize your medical records.")
    }
  }

  // Handle phone submission to dispatch live OTP code
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)

    let formattedPhone = phoneNumber.trim().replace(/\s+/g, '')
    if (!formattedPhone) {
      setError('Please provide a valid phone number.')
      setLoading(false)
      return
    }

    // Auto-prefix country code +91 if user did not provide a leading '+' sign
    if (!formattedPhone.startsWith('+')) {
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
      const user = await verifyOtp(confirmationResultRef.current, otpCode)
      await checkUserProfileAndProceed(user)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Incorrect passcode. Please check and retry.')
    } finally {
      setLoading(false)
    }
  }

  // Auto detect user GPS coordinates during onboarding
  const handleAutoDetectLocation = () => {
    setError('')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setOnboardLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        },
        (err) => {
          console.warn("Location permission denied", err)
          setError("Location permission denied. Please write address manually.")
        }
      )
    } else {
      setError("Geolocation is not supported in this browser.")
    }
  }

  // Complete first-time user profile registration
  const handleCompleteOnboarding = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!onboardName || !onboardEmergencyNumber || !onboardEmergencyEmail) {
      setError('Please fill in all clinical and emergency contact inputs.')
      setLoading(false)
      return
    }

    try {
      const user = tempUser
      if (!user) throw new Error('No authenticated user session found.')

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: onboardName,
        email: onboardEmail,
        phone: user.phoneNumber || phoneNumber || '',
        emergencyNumber: onboardEmergencyNumber,
        emergencyEmail: onboardEmergencyEmail,
        location: onboardLocation,
        healthScore: 85,
        createdAt: serverTimestamp(),
      }, { merge: true })

      // Sync the Auth Context state
      await refreshProfile()
      navigate('/home')
    } catch (err) {
      console.error("Onboarding submission failed:", err)
      setError(err.message || 'Failed to complete profile creation.')
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
      const user = await loginGoogle()
      await checkUserProfileAndProceed(user)
    } catch (err) {
      setError(err.message || 'Google identity assertion aborted.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cyber-black relative overflow-hidden px-4 py-8">
      {/* Invisible Recaptcha Element */}
      <div id="recaptcha-container" className="hidden"></div>

      {/* Cyber grid background */}
      <div className="cyber-grid" />

      {/* Floating radial glow meshes */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-neon-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[480px] relative z-10">
        {/* MediVerse AI brand header */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(15,76,129,0.15)] border border-cyber-border"
          >
            <HeartPulse size={24} className="text-white" />
          </motion.div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-extrabold font-heading text-neon-blue tracking-wide"
          >
            MEDIVERSE AI
          </motion.h1>
          <p className="text-[9px] text-text-secondary uppercase tracking-[0.2em] mt-1 font-bold flex items-center gap-1">
            <Sparkles size={9} className="text-neon-blue animate-pulse" />
            SECURE NATIONAL PATIENT IDENTITY
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="bg-white border border-[#E2E8F0] rounded-3xl shadow-[0_20px_50px_rgba(15,76,129,0.06)] p-8 md:p-10"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl border border-neon-red/20 bg-neon-red/5 text-neon-red text-xs font-semibold flex items-center gap-2"
            >
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* ─── ONBOARDING PROFILE REGISTRATION SCREEN ─────────── */}
            {isOnboarding ? (
              <motion.form
                key="onboarding-step"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleCompleteOnboarding}
                className="space-y-5 text-left"
              >
                <div className="border-b border-[#F1F5F9] pb-4 mb-5">
                  <h2 className="text-base font-extrabold font-heading text-neon-blue uppercase tracking-wider">
                    Complete Clinical Profile
                  </h2>
                  <p className="text-[10px] text-text-secondary mt-1 block leading-normal font-medium">
                    Register your vital medical emergency routing parameters before entry.
                  </p>
                </div>

                {/* Patient Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary flex items-center gap-1.5">
                    <User size={12} className="text-neon-blue" /> Full Name <span className="text-neon-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={onboardName}
                    onChange={(e) => setOnboardName(e.target.value)}
                    className="w-full px-4 rounded-xl text-sm"
                  />
                </div>

                {/* Patient Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary flex items-center gap-1.5">
                    <Mail size={12} className="text-neon-blue" /> Personal Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rajesh@gmail.com"
                    value={onboardEmail}
                    onChange={(e) => setOnboardEmail(e.target.value)}
                    className="w-full px-4 rounded-xl text-sm"
                  />
                </div>

                {/* Primary Location */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary flex items-center gap-1.5">
                    <MapPin size={12} className="text-neon-blue" /> Patient Location / Coordinates
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. New Delhi, Delhi or coordinates"
                      value={onboardLocation}
                      onChange={(e) => setOnboardLocation(e.target.value)}
                      className="flex-1 px-4 rounded-xl text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAutoDetectLocation}
                      className="px-4 h-[46px] rounded-xl border border-neon-purple text-neon-purple hover:bg-neon-purple/5 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center"
                    >
                      Auto-GPS
                    </button>
                  </div>
                </div>

                {/* Emergency Phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neon-red flex items-center gap-1.5 font-extrabold">
                    <Phone size={12} /> Emergency Contact Phone <span className="text-neon-red">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 99999 88888"
                    value={onboardEmergencyNumber}
                    onChange={(e) => setOnboardEmergencyNumber(e.target.value)}
                    className="w-full px-4 rounded-xl text-sm border-neon-red/30 focus:border-neon-red!"
                  />
                </div>

                {/* Emergency Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neon-red flex items-center gap-1.5 font-extrabold">
                    <Mail size={12} /> Emergency Contact Email <span className="text-neon-red">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. guardian@gmail.com"
                    value={onboardEmergencyEmail}
                    onChange={(e) => setOnboardEmergencyEmail(e.target.value)}
                    className="w-full px-4 rounded-xl text-sm border-neon-red/30 focus:border-neon-red!"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  type="submit"
                  className="w-full h-[48px] rounded-xl font-heading text-xs font-bold tracking-widest text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all bg-neon-blue shadow-[0_4px_12px_rgba(15,76,129,0.2)] mt-6"
                >
                  {loading ? (
                    <span>REGISTERING IDENTITY...</span>
                  ) : (
                    <>
                      <span>COMPLETE PROFILE</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : !isOtpSent ? (
              // ─── STEP 1: INPUT PHONE NUMBER ─────────────────────
              <motion.form
                key="phone-input-step"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSendOtp}
                className="space-y-6 text-left"
              >
                <div className="border-b border-[#F1F5F9] pb-4 mb-5">
                  <h2 className="text-lg font-extrabold font-heading text-neon-blue uppercase tracking-wider">
                    Secure Patient Access
                  </h2>
                  <p className="text-[10px] text-text-secondary mt-1 font-medium tracking-wide">
                    Login or register using India's national medical verification network.
                  </p>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  Verify your Identity using secure One-Time Passcode. Enter mobile phone details below:
                </p>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block">Mobile Phone Number</label>
                  <div className="relative flex items-center">
                    <Phone size={15} className="absolute left-4 text-text-muted z-10" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98765 43210 (without country code)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                  <p className="text-[9px] text-text-muted font-bold tracking-wide">
                    System will automatically prefix country code +91 for India.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  type="submit"
                  className="w-full h-[48px] rounded-xl font-heading text-xs font-bold tracking-widest text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all bg-neon-blue hover:bg-[#0B3A63] shadow-[0_4px_14px_rgba(15,76,129,0.2)] mt-2"
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
              // ─── STEP 2: INPUT VERIFICATION CODE ──────────────────
              <motion.form
                key="otp-verify-step"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleVerifyOtp}
                className="space-y-6 text-left"
              >
                <div className="border-b border-[#F1F5F9] pb-4 mb-5">
                  <h2 className="text-lg font-extrabold font-heading text-neon-blue uppercase tracking-wider">
                    Enter Verification Code
                  </h2>
                  <p className="text-[10px] text-text-secondary mt-1 font-medium tracking-wide">
                    Verify the security passcode dispatched to your device.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => { setIsOtpSent(false); resetState(); }}
                    className="text-[10px] text-neon-blue hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <ArrowLeft size={12} /> Change number
                  </button>
                  <span className="text-[10px] text-text-secondary font-bold">Sent to: {phoneNumber}</span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  Please key in the 6-digit passcode transmitted to your mobile number.
                </p>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block">Security Passcode (6-Digits)</label>
                  <div className="relative flex items-center">
                    <KeyRound size={15} className="absolute left-4 text-text-muted z-10" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      pattern="\d{6}"
                      placeholder="e.g. 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-center text-sm font-bold tracking-[0.3em]"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  type="submit"
                  className="w-full h-[48px] rounded-xl font-heading text-xs font-bold tracking-widest text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all bg-neon-purple hover:bg-[#0F8A7D] shadow-[0_4px_14px_rgba(20,184,166,0.2)] mt-2"
                >
                  {loading ? (
                    <span>VERIFYING CODE...</span>
                  ) : (
                    <>
                      <span>VERIFY & SIGN IN</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </motion.button>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-text-muted font-medium">Didn't receive passcode?</span>
                  {timer > 0 ? (
                    <span className="text-text-muted font-bold">Resend in {timer}s</span>
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

          {!isOnboarding && (
            <>
              <div className="relative flex items-center justify-center my-8">
                <div className="absolute inset-0 w-full h-[1px] bg-[#F1F5F9]" />
                <span className="relative z-10 px-4 bg-white text-[9px] uppercase font-extrabold tracking-widest text-text-muted">
                  OR IDENTITY BRIDGE
                </span>
              </div>

              {/* Google Authentication Portal fallback */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-[46px] rounded-xl bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-xs text-text-secondary font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="mr-1">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.013c1.49 0 2.854.55 3.907 1.455l3.057-3.057C19.102 3.1 16.697 2 13.99 2 8.163 2 3.5 6.663 3.5 12.5S8.163 23 13.99 23c5.383 0 9.877-3.85 9.877-9.5 0-.712-.083-1.4-.217-2.073l-11.41-.142z"/>
                </svg>
                <span>Sign in with Google Account</span>
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Footer validation and security tags */}
        <div className="flex items-center justify-center gap-2 mt-8 text-[10px] text-text-muted font-semibold">
          <Shield size={12} className="text-neon-blue" />
          <span>Biometric validation and secure SSL tunneling active</span>
        </div>
      </div>
    </div>
  )
}
