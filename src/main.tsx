import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { StoreProvider } from './store'
import { AuthProvider } from './auth/AuthProvider'
import { RequireAuth } from './app/AppLayout'
import LandingB2B from './pages/LandingB2B'
import LandingClub from './pages/LandingClub'
import DemoHub from './pages/DemoHub'
import Caja from './pages/Caja'
import Alta from './pages/Alta'
import Socio from './pages/Socio'
import Panel from './pages/Panel'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import AppHome from './pages/app/AppHome'
import AdminConsole from './pages/app/AdminConsole'
import CafeDashboard from './pages/app/CafeDashboard'
import CafeCaja from './pages/app/CafeCaja'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <StoreProvider>
        <HashRouter>
          <Routes>
            {/* Público */}
            <Route path="/" element={<LandingB2B />} />
            <Route path="/club" element={<LandingClub />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Demo sandbox (datos simulados) */}
            <Route path="/demo" element={<DemoHub />} />
            <Route path="/demo/caja" element={<Caja />} />
            <Route path="/demo/alta" element={<Alta />} />
            <Route path="/demo/socio" element={<Socio />} />
            <Route path="/demo/panel" element={<Panel />} />

            {/* Producto real (requiere login) */}
            <Route path="/app" element={<RequireAuth><AppHome /></RequireAuth>} />
            <Route path="/app/admin" element={<RequireAuth><AdminConsole /></RequireAuth>} />
            <Route path="/app/cafe" element={<RequireAuth><CafeDashboard /></RequireAuth>} />
            <Route path="/app/caja" element={<RequireAuth><CafeCaja /></RequireAuth>} />
          </Routes>
        </HashRouter>
      </StoreProvider>
    </AuthProvider>
  </StrictMode>,
)
