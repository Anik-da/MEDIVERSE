import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-cyber-black">
      {/* Background */}
      <div className="cyber-grid" />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main content */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ marginLeft: sidebarOpen ? '280px' : '76px' }}
      >
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 relative z-10 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
