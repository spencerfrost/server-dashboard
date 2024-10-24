import { Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Overview from './pages/Overview'

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        {/* Add other routes as we create them */}
        <Route path="*" element={<Overview />} />
      </Routes>
    </DashboardLayout>
  )
}

export default App