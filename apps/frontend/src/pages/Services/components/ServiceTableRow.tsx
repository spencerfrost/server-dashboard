import { TableCell, TableRow } from '@/components/ui/table'
import { Service } from '@server-dashboard/types'
import { ResourceMetrics } from './ResourceMetrics'
import { ServiceStatusBadge } from './ServiceStatusBadge'
import { ServiceTypeIcon } from './ServiceTypeIcon'

interface ServiceTableRowProps {
  service: Service
  showType: boolean
}

export const ServiceTableRow: React.FC<ServiceTableRowProps> = ({ 
  service, 
  showType 
}) => (
  <TableRow>
    <TableCell className="py-2">
      <div className="font-medium">{service.name}</div>
    </TableCell>
    <TableCell>
      <ServiceStatusBadge status={service.status} />
    </TableCell>
    <TableCell>
      <ResourceMetrics 
        memory={service.memory} 
        cpu={service.cpu} 
      />
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
)