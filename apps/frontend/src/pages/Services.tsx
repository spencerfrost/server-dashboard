import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useServices } from '@/hooks/useServerData';
import { formatBytes } from '@/lib/utils';
import { Service, ServiceStatus } from '@server-dashboard/types';
import { AlertCircle } from 'lucide-react';
import React from 'react';

const ServiceTypeIcon: React.FC<{ type: Service['type'] }> = ({ type }) => {
  const iconClasses = {
    app: 'bg-blue-100 text-blue-800',
    system: 'bg-purple-100 text-purple-800',
    database: 'bg-green-100 text-green-800',
    monitoring: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${iconClasses[type]}`}>
      {type}
    </span>
  );
};

const StatusBadge: React.FC<{ status: Service['status'] }> = ({ status }) => {
  const statusClasses = {
    running: 'bg-green-100 text-green-800',
    stopped: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

const ServiceTable: React.FC<{
  services: Service[];
  showType?: boolean;
}> = ({ services, showType = true }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Resources</TableHead>
        <TableHead>Uptime</TableHead>
        {showType && <TableHead>Type</TableHead>}
      </TableRow>
    </TableHeader>
    <TableBody>
      {services.map((service) => (
        <TableRow key={service.id}>
          <TableCell className="py-2">
            <div className="font-medium">{service.name}</div>
          </TableCell>
          <TableCell>
            <StatusBadge status={service.status} />
          </TableCell>
          <TableCell>
            <div className="space-y-1 text-sm">
              {typeof service.memory === 'number' && service.memory > 0 && (
                <div>Memory: {formatBytes(service.memory)}</div>
              )}
              {typeof service.cpu === 'number' && service.cpu > 0 && (
                <div>CPU: {service.cpu.toFixed(1)}%</div>
              )}
            </div>
          </TableCell>
          <TableCell>
            <div className="text-sm">{service.uptime || 'N/A'}</div>
          </TableCell>
          {showType && (
            <TableCell>
              <ServiceTypeIcon type={service.type} />
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const LoadingSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-1/4" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);

const Services: React.FC = () => {
  const { data: services, isLoading, error } = useServices('all', 'full');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error loading services: {error.message}</AlertDescription>
      </Alert>
    );
  }

  const isService = (item: Service | ServiceStatus): item is Service => {
    return 'type' in item;
  };

  // Filter and group services
  const allServices = (services || []).filter(isService);
  
  // Separate Docker services
  const dockerServices = allServices.filter(
    service => service.type === 'app'
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Group system services by category
  const systemServices = allServices.filter(
    service => service.type === 'system' && service.category
  );

  const groupedSystemServices = systemServices.reduce((acc, service) => {
    const categoryId = service.category?.id || 'other';
    if (!acc[categoryId]) {
      acc[categoryId] = {
        name: service.category?.name || 'Other Services',
        services: []
      };
    }
    acc[categoryId].services.push(service);
    return acc;
  }, {} as Record<string, { name: string; services: Service[] }>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services</h2>
      </div>

      {/* Docker Services */}
      <Card>
        <CardHeader>
          <CardTitle>Docker Services</CardTitle>
        </CardHeader>
        <CardContent>
          {dockerServices.length > 0 ? (
            <ServiceTable services={dockerServices} showType={false} />
          ) : (
            <p className="text-sm text-gray-500">No Docker services running</p>
          )}
        </CardContent>
      </Card>

      {/* System Services by Category */}
      {Object.entries(groupedSystemServices)
        .sort(([, a], [, b]) => a.name.localeCompare(b.name))
        .map(([categoryId, category]) => (
          <Card key={categoryId}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceTable 
                services={category.services.sort((a, b) => a.name.localeCompare(b.name))} 
                showType={false}
              />
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default Services;