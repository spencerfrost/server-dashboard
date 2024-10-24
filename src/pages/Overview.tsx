import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceStatus } from '@/types/server'
import React from 'react'

interface StatusBadgeProps {
  status: 'healthy' | 'warning' | 'error'
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-sm 
    ${status === 'healthy' ? 'bg-green-100 text-green-800' : 
      status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
      'bg-red-100 text-red-800'}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
)

const Overview: React.FC = () => {
  const services: ServiceStatus[] = [
    { name: 'Nginx Reverse Proxy', status: 'healthy', uptime: '25 days', memory: 128, cpu: 0.2 },
    { name: 'Docker Engine', status: 'healthy', uptime: '25 days', memory: 256, cpu: 1.5 },
    { name: 'Prometheus', status: 'healthy', uptime: '10 days', memory: 512, cpu: 2.1 },
    { name: 'Grafana', status: 'healthy', uptime: '10 days', memory: 256, cpu: 0.8 },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">System Overview</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Ubuntu 22.04.1 LTS</p>
            <p>AMD Ryzen 5 5500</p>
            <p>32GB RAM</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">Docker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>40 Running Containers</p>
            <p>92 Images</p>
            <p>11 Named Volumes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">Network</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>12 Docker Networks</p>
            <p>Tailscale VPN Active</p>
            <p>Nginx Reverse Proxy</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Critical Services Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between">
                <span>{service.name}</span>
                <StatusBadge status={service.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Updates */}
      <Alert>
        <AlertDescription>
          Last documentation update: October 24, 2024 - Added new port management schema
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default Overview