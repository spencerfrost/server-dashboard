import { Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Configuration from './pages/Configuration'
import Docker from './pages/Docker'
import Documentation from './pages/Documentation'
import Monitoring from './pages/Monitoring'
import Network from './pages/Network'
import Overview from './pages/Overview'
import Security from './pages/Security'
import Services from './pages/Services'
import Storage from './pages/Storage'

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/services" element={<Services />} />
        <Route path="/docker" element={<Docker />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/network" element={<Network />} />
        <Route path="/security" element={<Security />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/config" element={<Configuration />} />
        <Route path="*" element={<Overview />} />
      </Routes>
    </DashboardLayout>
  )
}

export default App