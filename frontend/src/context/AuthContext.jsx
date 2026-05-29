import { createContext, useContext, useEffect, useState } from 'react'
import { 
  onAuthChange, 
  loginUser, 
  registerUser, 
  logoutUser, 
  signInWithGoogle, 
  getUserProfile,
  setUpRecaptcha,
  sendOtpToPhone,
  verifyOtpCode
} from '../services/firebaseService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        setCurrentUser(user)
        try {
          const profile = await getUserProfile(user.uid)
          setUserProfile(profile)
        } catch (err) {
          console.error("Error fetching profile:", err)
        }
      } else {
        setCurrentUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const initRecaptcha = (containerId) => {
    return setUpRecaptcha(containerId)
  }

  const sendOtp = async (phoneNumber, verifier) => {
    setLoading(true)
    try {
      return await sendOtpToPhone(phoneNumber, verifier)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (confirmationResult, code) => {
    setLoading(true)
    try {
      const user = await verifyOtpCode(confirmationResult, code)
      const profile = await getUserProfile(user.uid)
      setUserProfile(profile)
      return user
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const user = await loginUser(email, password)
      const profile = await getUserProfile(user.uid)
      setUserProfile(profile)
      return user
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password, displayName) => {
    setLoading(true)
    try {
      const user = await registerUser(email, password, displayName)
      const profile = await getUserProfile(user.uid)
      setUserProfile(profile)
      return user
    } finally {
      setLoading(false)
    }
  }

  const loginGoogle = async () => {
    setLoading(true)
    try {
      const user = await signInWithGoogle()
      const profile = await getUserProfile(user.uid)
      setUserProfile(profile)
      return user
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await logoutUser()
      setCurrentUser(null)
      setUserProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const setSimulatedUser = (user, profile) => {
    setCurrentUser(user)
    setUserProfile(profile)
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    initRecaptcha,
    sendOtp,
    verifyOtp,
    login,
    register,
    loginGoogle,
    logout,
    setSimulatedUser,
    refreshProfile: async () => {
      if (currentUser) {
        const p = await getUserProfile(currentUser.uid)
        setUserProfile(p)
      }
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
