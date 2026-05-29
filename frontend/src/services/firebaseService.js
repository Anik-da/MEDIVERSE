/**
 * MediVerse AI — Firebase Service Layer
 * Reusable functions for Auth, Firestore, Realtime DB, and Storage.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'

import {
  ref as dbRef,
  set as dbSet,
  get as dbGet,
  push as dbPush,
  onValue,
  update as dbUpdate,
  remove as dbRemove,
} from 'firebase/database'

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'

import { auth, db, rtdb, storage } from '../firebase'

/* ═══════════════════════════════════════════════════════════
   AUTH SERVICES
   ═══════════════════════════════════════════════════════════ */

/** Register a new user with email & password */
export const registerUser = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) {
    await updateProfile(userCredential.user, { displayName })
  }
  // Save user profile to Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    name: displayName || '',
    email,
    createdAt: serverTimestamp(),
    healthScore: 0,
    profile: {},
  })
  return userCredential.user
}

/** Sign in existing user */
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

/** Google sign-in */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  // Ensure user profile exists in Firestore
  const userDoc = await getDoc(doc(db, 'users', result.user.uid))
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', result.user.uid), {
      name: result.user.displayName || '',
      email: result.user.email,
      createdAt: serverTimestamp(),
      healthScore: 0,
      profile: {},
    })
  }
  return result.user
}

/** Sign out */
export const logoutUser = () => signOut(auth)

/** Listen to auth state changes */
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback)

/** Initialize invisible Recaptcha verifier */
export const setUpRecaptcha = (containerId) => {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear()
    } catch (e) {
      console.warn("Recaptcha verifier clear error:", e)
    }
  }
  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('Recaptcha solved successfully!')
    },
    'expired-callback': () => {
      console.warn('Recaptcha expired.')
    }
  })
  return window.recaptchaVerifier
}

/** Trigger SMS OTP to user's phone */
export const sendOtpToPhone = async (phoneNumber, verifier) => {
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier)
  window.confirmationResult = confirmationResult
  return confirmationResult
}

/** Verify received OTP code */
export const verifyOtpCode = async (confirmationResult, code) => {
  const result = await confirmationResult.confirm(code)
  
  // Create default profile in Firestore if not existing
  const userDoc = await getDoc(doc(db, 'users', result.user.uid))
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', result.user.uid), {
      name: `User ${result.user.phoneNumber.slice(-4)}`,
      phone: result.user.phoneNumber,
      email: '',
      createdAt: serverTimestamp(),
      healthScore: 80,
      profile: {},
    })
  }
  return result.user
}

/* ═══════════════════════════════════════════════════════════
   FIRESTORE SERVICES (Document DB)
   ═══════════════════════════════════════════════════════════ */

/** Save a symptom check result */
export const saveSymptomLog = async (userId, symptoms, predictions) => {
  return addDoc(collection(db, 'symptom_logs'), {
    userId,
    symptoms,
    predictions,
    createdAt: serverTimestamp(),
  })
}

/** Get user's symptom history */
export const getSymptomHistory = async (userId, maxResults = 20) => {
  const q = query(
    collection(db, 'symptom_logs'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

/** Save emergency alert log */
export const saveEmergencyLog = async (userId, data) => {
  return addDoc(collection(db, 'emergency_logs'), {
    userId,
    ...data,
    status: 'active',
    createdAt: serverTimestamp(),
  })
}

/** Save mental health chat message */
export const saveChatMessage = async (userId, message, mood, aiResponse) => {
  return addDoc(collection(db, 'mental_health_chats'), {
    userId,
    message,
    mood,
    aiResponse,
    createdAt: serverTimestamp(),
  })
}

/** Save medicine scan result */
export const saveMedicineScan = async (userId, result) => {
  return addDoc(collection(db, 'medicine_scans'), {
    userId,
    ...result,
    createdAt: serverTimestamp(),
  })
}

/** Save OCR report result */
export const saveReportScan = async (userId, report) => {
  return addDoc(collection(db, 'report_scans'), {
    userId,
    ...report,
    createdAt: serverTimestamp(),
  })
}

/** Save voice diagnosis result */
export const saveVoiceDiagnosis = async (userId, analysis) => {
  return addDoc(collection(db, 'voice_diagnoses'), {
    userId,
    ...analysis,
    createdAt: serverTimestamp(),
  })
}

/** Update user health profile */
export const updateUserProfile = async (userId, data) => {
  return updateDoc(doc(db, 'users', userId), data)
}

/** Get user profile */
export const getUserProfile = async (userId) => {
  const snap = await getDoc(doc(db, 'users', userId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

/** Listen to user profile changes in real-time */
export const onUserProfileChange = (userId, callback) => {
  return onSnapshot(doc(db, 'users', userId), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
  })
}

/** Save emergency contacts */
export const saveEmergencyContacts = async (userId, contacts) => {
  return setDoc(doc(db, 'emergency_contacts', userId), {
    contacts,
    updatedAt: serverTimestamp(),
  })
}

/** Get emergency contacts */
export const getEmergencyContacts = async (userId) => {
  const snap = await getDoc(doc(db, 'emergency_contacts', userId))
  return snap.exists() ? snap.data().contacts : []
}

/* ═══════════════════════════════════════════════════════════
   REALTIME DATABASE SERVICES (Live data)
   ═══════════════════════════════════════════════════════════ */

/** Update user's live location (for emergency tracking) */
export const updateLiveLocation = async (userId, lat, lng) => {
  return dbSet(dbRef(rtdb, `live_locations/${userId}`), {
    latitude: lat,
    longitude: lng,
    updatedAt: Date.now(),
  })
}

/** Listen to live location changes */
export const onLiveLocationChange = (userId, callback) => {
  return onValue(dbRef(rtdb, `live_locations/${userId}`), (snapshot) => {
    callback(snapshot.val())
  })
}

/** Update emergency alert status in real-time */
export const updateEmergencyStatus = async (alertId, status) => {
  return dbUpdate(dbRef(rtdb, `emergency_alerts/${alertId}`), {
    status,
    updatedAt: Date.now(),
  })
}

/** Listen to emergency alert updates */
export const onEmergencyUpdate = (alertId, callback) => {
  return onValue(dbRef(rtdb, `emergency_alerts/${alertId}`), (snapshot) => {
    callback(snapshot.val())
  })
}

/** Save daily mood entry */
export const saveDailyMood = async (userId, mood, score) => {
  const today = new Date().toISOString().split('T')[0]
  return dbSet(dbRef(rtdb, `mood_tracker/${userId}/${today}`), {
    mood,
    score,
    timestamp: Date.now(),
  })
}

/** Get mood history */
export const getMoodHistory = async (userId) => {
  const snapshot = await dbGet(dbRef(rtdb, `mood_tracker/${userId}`))
  return snapshot.val() || {}
}

/* ═══════════════════════════════════════════════════════════
   STORAGE SERVICES (File uploads)
   ═══════════════════════════════════════════════════════════ */

/** Upload medicine image and get download URL */
export const uploadMedicineImage = async (userId, file) => {
  const path = `medicine_scans/${userId}/${Date.now()}_${file.name}`
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}

/** Upload medical report (PDF/image) */
export const uploadMedicalReport = async (userId, file) => {
  const path = `medical_reports/${userId}/${Date.now()}_${file.name}`
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}

/** Upload voice recording */
export const uploadVoiceRecording = async (userId, blob) => {
  const path = `voice_recordings/${userId}/${Date.now()}.webm`
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, blob)
  return getDownloadURL(fileRef)
}

/** Upload profile avatar */
export const uploadAvatar = async (userId, file) => {
  const path = `avatars/${userId}`
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}
