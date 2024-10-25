import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useServices } from '@/hooks/useServerData'
import { Service, ServiceStatus } from '@server-dashboard/types'
import { AlertCircle } from 'lucide-react'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { ServiceTable } from './components/ServiceTable'

const Services = () => {
  const { data: services, isLoading, error } = useServices('all', 'full')

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error loading services: {error.message}</AlertDescription>
      </Alert>
    )
  }

  const isService = (item: Service | ServiceStatus): item is Service => {
    return 'type' in item
  }

  // Filter and group services
  const allServices = (services || []).filter(isService)
  
  // Separate Docker services
  const dockerServices = allServices
    .filter(service => service.type === 'app')
    .sort((a, b) => a.name.localeCompare(b.name))

  // Group system services by category
  const systemServices = allServices.filter(
    service => service.type === 'system' && service.category
  )

  const groupedSystemServices = systemServices.reduce((acc, service) => {
    const categoryId = service.category?.id || 'other'
    if (!acc[categoryId]) {
      acc[categoryId] = {
        name: service.category?.name || 'Other Services',
        services: []
      }
    }
    acc[categoryId].services.push(service)
    return acc
  }, {} as Record<string, { name: string; services: Service[] }>)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Services</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <Card className="w-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Docker Services</CardTitle>
          </CardHeader>
          <CardContent>
            {dockerServices.length > 0 ? (
              <ServiceTable 
                services={dockerServices} 
                showType={false} 
              />
            ) : (
              <p className="text-sm text-gray-500">No Docker services running</p>
            )}
          </CardContent>
        </Card>

        {Object.entries(groupedSystemServices)
          .sort(([, a], [, b]) => a.name.localeCompare(b.name))
          .map(([categoryId, category]) => (
            <Card key={categoryId} className="w-full">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ServiceTable 
                  services={category.services.sort((a, b) => a.name.localeCompare(b.name))} 
                  showType={false}
                  compact={true}
                />
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

export default Services