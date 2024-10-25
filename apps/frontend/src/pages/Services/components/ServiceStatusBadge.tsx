import { Service } from '@server-dashboard/types'

interface ServiceStatusBadgeProps {
  status: Service['status']
}

export const ServiceStatusBadge: React.FC<ServiceStatusBadgeProps> = ({ status }) => {
  const statusClasses = {
    running: 'bg-green-100 text-green-800',
    stopped: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
      {status}
    </span>
  )
}