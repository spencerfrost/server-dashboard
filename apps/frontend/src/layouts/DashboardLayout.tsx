import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"
import {
  Activity,
  Dock,
  File,
  HardDrive,
  Layers,
  Network,
  Server,
  Settings,
  Shield
} from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { id: 'overview', label: 'Overview', icon: Layers, path: '/' },
  { id: 'services', label: 'Services', icon: Server, path: '/services' },
  { id: 'docker', label: 'Docker', icon: Dock, path: '/docker' },
  { id: 'storage', label: 'Storage', icon: HardDrive, path: '/storage' },
  { id: 'network', label: 'Network', icon: Network, path: '/network' },
  { id: 'security', label: 'Security', icon: Shield, path: '/security' },
  { id: 'docs', label: 'Documentation', icon: File, path: '/docs' },
  { id: 'monitoring', label: 'Monitoring', icon: Activity, path: '/monitoring' },
  { id: 'config', label: 'Configuration', icon: Settings, path: '/config' }
]

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <h1 className="text-xl font-bold">CAKE Server</h1>
            <p className="text-sm text-muted-foreground">Documentation & Monitoring</p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={
                          item.path === '/' 
                            ? location.pathname === '/'
                            : location.pathname.startsWith(item.path)
                        }
                      >
                        <Link to={item.path} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 overflow-auto bg-background">
          <div className="h-full w-full p-8">
            <SidebarTrigger />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout