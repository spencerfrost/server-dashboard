import { formatBytes } from '@/lib/utils'
import React from 'react'

interface ResourceMetricsProps {
  memory?: number
  cpu?: number
}

export const ResourceMetrics: React.FC<ResourceMetricsProps> = ({ memory, cpu }) => (
  <div className="space-y-1 text-sm">
    {typeof memory === 'number' && memory > 0 && (
      <div>Memory: {formatBytes(memory)}</div>
    )}
    {typeof cpu === 'number' && cpu > 0 && (
      <div>CPU: {cpu.toFixed(1)}%</div>
    )}
  </div>
)