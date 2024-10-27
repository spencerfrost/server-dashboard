import { formatBytes } from '@/lib/utils';
import React from 'react';

interface ResourceMetricsProps {
  resources?: {
    memory?: number;
    cpu?: number;
  };
}

export const ResourceMetrics: React.FC<ResourceMetricsProps> = ({ resources }) => {
  const { memory, cpu } = resources || {};

  return (
    <div className="space-y-1 text-sm">
      {memory !== undefined && <div>Memory: {formatBytes(memory)}</div>}
      {cpu !== undefined && <div>CPU: {cpu.toFixed(1)}%</div>}
    </div>
  );
};