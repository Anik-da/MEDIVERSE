import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

// MediVerse AI Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4Od46dfd_-SjXgoJxtr_gMpqQQt45SS4",
  authDomain: "mediverse-c2d59.firebaseapp.com",
  databaseURL: "https://mediverse-c2d59-default-rtdb.firebaseio.com",
  projectId: "mediverse-c2d59",
  storageBucket: "mediverse-c2d59.firebasestorage.app",
  messagingSenderId: "589930110886",
  appId: "1:589930110886:web:5e93e5b4ed3c5b0ff4f967",
  measurementId: "G-9JY39080BY",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services safely
export const auth = getAuth(app)
export const db = getFirestore(app)          // Firestore (documents/collections)
export const rtdb = getDatabase(app)         // Realtime Database
export const storage = getStorage(app)       // File storage

let analyticsInstance = null
isSupported().then((supported) => {
  if (supported) {
    analyticsInstance = getAnalytics(app)
  }
}).catch((err) => {
  console.warn("Firebase Analytics not supported in this browser environment:", err)
})
export const analytics = analyticsInstance

export default app
