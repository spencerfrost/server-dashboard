import { Service } from '@server-dashboard/types'

interface ServiceTypeIconProps {
  type: Service['type']
}

export const ServiceTypeIcon: React.FC<ServiceTypeIconProps> = ({ type }) => {
  const iconClasses = {
    app: 'bg-blue-100 text-blue-800',
    system: 'bg-purple-100 text-purple-800',
    database: 'bg-green-100 text-green-800',
    monitoring: 'bg-yellow-100 text-yellow-800',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${iconClasses[type]}`}>
      {type}
    </span>
  )
}