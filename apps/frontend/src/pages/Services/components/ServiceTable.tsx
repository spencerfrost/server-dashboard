import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Service } from '@server-dashboard/types'
import { ServiceTableRow } from './ServiceTableRow'

interface ServiceTableProps {
  services: Service[]
  showType?: boolean
  compact?: boolean // New prop to control table size
}

export const ServiceTable: React.FC<ServiceTableProps> = ({ 
  services, 
  showType = true,
  compact = false // Default to false for backward compatibility
}) => (
  <div className={`overflow-x-auto ${compact ? 'max-h-[400px]' : ''}`}>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap">Name</TableHead>
          <TableHead className="whitespace-nowrap">Status</TableHead>
          <TableHead className="whitespace-nowrap">Resources</TableHead>
          <TableHead className="whitespace-nowrap">Uptime</TableHead>
          {showType && <TableHead className="whitespace-nowrap">Type</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <ServiceTableRow 
            key={service.id} 
            service={service} 
            showType={showType}
          />
        ))}
      </TableBody>
    </Table>
  </div>
)