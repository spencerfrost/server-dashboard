// frontend/src/pages/Docker/components/DockerStats.tsx
import { Card, CardContent } from '@/components/ui/card';
import { useDockerStats } from '@/hooks/useDocker';
import { Archive, HardDrive, Network } from 'lucide-react';
import { FC } from 'react';
import { StatusPill } from './StatusPill';

export const DockerStats: FC = () => {
  const { data: stats } = useDockerStats();

  if (!stats) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <StatusPill 
              count={stats.containersRunning} 
              label="Running" 
              color="success" 
            />
            <StatusPill 
              count={stats.containersStopped} 
              label="Stopped" 
              color="warning" 
            />
            <StatusPill 
              count={stats.containersErrored} 
              label="Error" 
              color="error" 
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              <span>{stats.images} Images</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              <span>{stats.volumes} Volumes</span>
            </div>
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span>{stats.networks} Networks</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};