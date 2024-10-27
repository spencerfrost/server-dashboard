import { TableCell, TableRow } from '@/components/ui/table'
import { ResourceMetrics } from '@/pages/Services/components/ResourceMetrics'
import { ServiceTypeIcon } from '@/pages/Services/components/ServiceTypeIcon'
import { Service } from '@server-dashboard/types'
import { ServiceStatusBadge } from './ServiceStatusBadge'

interface ServiceTableRowProps {
  service: Service
  showType: boolean
}

export const ServiceTableRow: React.FC<ServiceTableRowProps> = ({ service, showType }) => (
  <TableRow>
    <TableCell className="py-2">
      <div className="font-medium">{service.name}</div>
    </TableCell>
    <TableCell>
      <ServiceStatusBadge status={service.status} />
    </TableCell>
    <TableCell>
      <ResourceMetrics resources={service.resources} />
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