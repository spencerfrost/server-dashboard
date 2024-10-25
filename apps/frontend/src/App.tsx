import { Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Overview from './pages/Overview'
import Services from './pages/Services'

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/services" element={<Services />} />
        {/* Add other routes as we create them */}
        <Route path="*" element={<Overview />} />
      </Routes>
    </DashboardLayout>
  )
}

export default App