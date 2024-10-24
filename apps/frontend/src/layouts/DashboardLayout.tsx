import { MenuItem } from '@/types/navigation'
import {
  Activity,
  File,
  HardDrive,
  Layers,
  Network,
  Server,
  Settings,
  Shield
} from 'lucide-react'
import React from 'react'

const menuItems: MenuItem[] = [
  { id: 'overview', label: 'Overview', icon: Layers, path: '/' },
  { id: 'services', label: 'Services', icon: Server, path: '/services' },
  { id: 'storage', label: 'Storage', icon: HardDrive, path: '/storage' },
  { id: 'network', label: 'Network', icon: Network, path: '/network' },
  { id: 'security', label: 'Security', icon: Shield, path: '/security' },
  { id: 'docs', label: 'Documentation', icon: File, path: '/docs' },
  { id: 'monitoring', label: 'Monitoring', icon: Activity, path: '/monitoring' },
  { id: 'config', label: 'Configuration', icon: Settings, path: '/config' }
]

interface SidebarItemProps {
  item: MenuItem
  isActive: boolean
  onClick: (id: string) => void
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, isActive, onClick }) => (
  <button
    onClick={() => onClick(item.id)}
    className={`flex items-center p-3 w-full rounded-lg transition-colors
      ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
  >
    <item.icon className="w-5 h-5 mr-3" />
    <span>{item.label}</span>
  </button>
)

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = React.useState('overview')

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-2">CAKE Server</h1>
          <p className="text-sm text-gray-600">Documentation & Monitoring</p>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={setActiveTab}
            />
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout