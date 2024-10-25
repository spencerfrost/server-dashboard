import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Service } from '@server-dashboard/types';
import React from 'react';

const findPortRanges = (ports: Service['portMapping']) => {
  // First, deduplicate ports and sort them
  const uniquePorts = Array.from(
    new Map(
      ports.map(p => [`${p.internal}-${p.protocol}`, { port: p.internal, protocol: p.protocol }])
    ).values()
  ).sort((a, b) => a.port - b.port);

  const ranges: Array<{
    start: number;
    end: number;
    protocol: string;
  }> = [];

  if (uniquePorts.length === 0) return ranges;

  let currentRange = {
    start: uniquePorts[0].port,
    end: uniquePorts[0].port,
    protocol: uniquePorts[0].protocol
  };

  for (let i = 1; i < uniquePorts.length; i++) {
    const current = uniquePorts[i];

    // If the current port is consecutive and has the same protocol, extend the range
    if (current.port === currentRange.end + 1 && current.protocol === currentRange.protocol) {
      currentRange.end = current.port;
    } else {
      // If not consecutive or different protocol, start a new range
      ranges.push({ ...currentRange });
      currentRange = {
        start: current.port,
        end: current.port,
        protocol: current.protocol
      };
    }
  }

  // Push the last range
  ranges.push(currentRange);

  return ranges;
};

// Helper function to format port ranges more cleanly
const formatPortRange = (range: { start: number; end: number; protocol: string }) => {
  if (range.start === range.end) {
    return `${range.start}`;
  }
  return `${range.start}-${range.end}`;
};

const ServiceTypeIcon: React.FC<{ type: Service['type'] }> = ({ type }) => {
  const iconClasses = {
    app: 'bg-blue-100 text-blue-800',
    system: 'bg-purple-100 text-purple-800',
    database: 'bg-green-100 text-green-800',
    monitoring: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${iconClasses[type]}`}
    >
      {type}
    </span>
  );
};

const StatusBadge: React.FC<{ status: 'running' | 'stopped' | 'error' }> = ({ status }) => {
  const statusClasses = {
    running: 'bg-green-100 text-green-800',
    stopped: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
};

const PortMapping: React.FC<{ ports: Service['portMapping'] }> = ({ ports }) => {
  // Special cases for services with no ports
  if (!ports || ports.length === 0) {
    return <div className="text-sm text-gray-500">No ports</div>;
  }

  // Find and format port ranges
  const ranges = findPortRanges(ports);
  
  // Group ranges by protocol
  const portsByProtocol: Record<string, string[]> = {};
  
  ranges.forEach(range => {
    if (!portsByProtocol[range.protocol]) {
      portsByProtocol[range.protocol] = [];
    }
    portsByProtocol[range.protocol].push(formatPortRange(range));
  });

  return (
    <div className="space-y-1">
      {Object.entries(portsByProtocol).map(([protocol, portList]) => {
        // Join all ports for this protocol with commas and add protocol at the end
        const formattedPorts = portList
          .filter((value, index, self) => self.indexOf(value) === index) // Remove any duplicate ranges
          .sort((a, b) => {
            const aStart = parseInt(a.split('-')[0]);
            const bStart = parseInt(b.split('-')[0]);
            return aStart - bStart;
          })
          .join(', ');
          
        return (
          <div key={protocol} className="text-sm">
            {formattedPorts} ({protocol})
          </div>
        );
      })}
    </div>
  );
};

const Services: React.FC = () => {
  const { data: services, isLoading, error } = useServices('all', 'full');

  if (isLoading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div>Error loading services: {error.message}</div>;
  }

  const groupedServices = services?.reduce((acc, service) => {
    const type = service.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(service);
    return acc;
  }, {} as Record<Service['type'], Service[]>);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services</h2>
      </div>

      {groupedServices && Object.entries(groupedServices).map(([type, services]) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className="capitalize">{type} Services</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ports</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Dependencies</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={service.status} />
                    </TableCell>
                    <TableCell>
                      <PortMapping ports={service.portMapping} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {service.memory && <div>Memory: {formatBytes(service.memory)}</div>}
                        {service.cpu && <div>CPU: {service.cpu.toFixed(1)}%</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {service.dependencies?.map((dep, idx) => (
                          <div key={idx}>{dep}</div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Services;