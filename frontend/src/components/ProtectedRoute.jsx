import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-cyber-black">
        <LoadingSpinner size="lg" />
        <p className="text-xs font-heading text-neon-blue tracking-widest uppercase mt-4 animate-pulse">AUTHORIZING IDENTITY...</p>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />
  }

  return children
}
