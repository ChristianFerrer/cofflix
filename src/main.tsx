import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { StoreProvider } from './store'
import LandingB2B from './pages/LandingB2B'
import LandingClub from './pages/LandingClub'
import DemoHub from './pages/DemoHub'
import Caja from './pages/Caja'
import Alta from './pages/Alta'
import Panel from './pages/Panel'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingB2B />} />
          <Route path="/club" element={<LandingClub />} />
          <Route path="/demo" element={<DemoHub />} />
          <Route path="/demo/caja" element={<Caja />} />
          <Route path="/demo/alta" element={<Alta />} />
          <Route path="/demo/panel" element={<Panel />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  </StrictMode>,
)
