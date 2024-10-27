// frontend/src/pages/Docker/components/ContainerDetails.tsx
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useContainer, useContainerAction } from '@/hooks/useDocker';
import { formatBytes } from '@/lib/utils';
import { Box, HardDrive, Play, RefreshCw, Square, Terminal } from 'lucide-react';
import { FC } from 'react';
import { ResourceCard } from './ResourceCard';

interface ContainerDetailsProps {
  containerId: string;
}

export const ContainerDetails: FC<ContainerDetailsProps> = ({ containerId }) => {
  const { data: container, isLoading } = useContainer(containerId);
  const containerAction = useContainerAction();

  if (isLoading || !container) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const handleAction = async (action: 'start' | 'stop' | 'restart') => {
    try {
      await containerAction.mutateAsync({ id: containerId, action });
    } catch (error) {
      console.error(`Failed to ${action} container:`, error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{container.name}</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Terminal className="mr-2 h-4 w-4" />
            Logs
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleAction('start')}
            disabled={container.state === 'running'}
          >
            <Play className="mr-2 h-4 w-4" />
            Start
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleAction('stop')}
            disabled={container.state !== 'running'}
          >
            <Square className="mr-2 h-4 w-4" />
            Stop
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleAction('restart')}
            disabled={container.state !== 'running'}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ResourceCard
          title="CPU Usage"
          value={`${container.stats.cpu_percent.toFixed(1)}%`}
          icon={<Box className="h-4 w-4 text-muted-foreground" />}
          usage={container.stats.cpu_percent}
        />
        <ResourceCard
          title="Memory Usage"
          value={formatBytes(container.stats.memory_usage)}
          icon={<HardDrive className="h-4 w-4 text-muted-foreground" />}
          usage={(container.stats.memory_usage / container.stats.memory_limit) * 100}
        />
      </div>

      <div className="rounded-lg border">
        <div className="bg-muted p-4">
          <h4 className="font-medium">Container Details</h4>
        </div>
        <div className="p-4">
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">Image</dt>
              <dd className="text-sm">{container.image}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="text-sm">{container.state}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">Ports</dt>
              <dd className="text-sm">
                {container.ports.map(p => `${p.external}:${p.internal}/${p.protocol}`).join(', ')}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">Uptime</dt>
              <dd className="text-sm">{container.uptime}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};