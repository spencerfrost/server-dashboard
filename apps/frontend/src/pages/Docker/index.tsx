import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useContainer, useContainerAction, useContainers, useDockerStats } from '@/hooks/useDocker'
import { formatBytes } from '@/lib/utils'
import { AlertCircle, Archive, ArrowDownUp, Box, Circle, HardDrive, Network, Play, RefreshCw, Square, Terminal } from 'lucide-react'
import { useCallback, useState } from 'react'

interface StatusPillProps {
  count: number
  label: string
  color: 'success' | 'warning' | 'error'
}

const StatusPill: React.FC<StatusPillProps> = ({ count, label, color }) => {
  const colors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  }

  return (
    <div className="flex items-center gap-2">
      <Circle className={`h-4 w-4 ${color === 'success' ? 'text-green-500' : color === 'warning' ? 'text-yellow-500' : 'text-red-500'}`} />
      <span className={`rounded-full px-2 py-1 text-sm font-medium ${colors[color]}`}>
        {count} {label}
      </span>
    </div>
  )
}

interface ResourceCardProps {
  title: string
  value: string
  icon: React.ReactNode
  usage?: number
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, value, icon, usage }) => (
  <div className="rounded-lg border bg-card p-4 text-card-foreground">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium">{title}</h3>
      {icon}
    </div>
    <p className="mt-2 text-2xl font-bold">{value}</p>
    {usage !== undefined && (
      <div className="mt-2">
        <Progress value={usage} className="h-1" />
        <p className="mt-1 text-xs text-muted-foreground">{usage}% used</p>
      </div>
    )}
  </div>
)

interface ContainerListProps {
  onSelect: (id: string) => void
  selectedId: string | null
}

const ContainerList: React.FC<ContainerListProps> = ({ onSelect, selectedId }) => {
  const { data: containers = [], isLoading } = useContainers();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {containers.map((container) => (
        <button
          key={container.id}
          onClick={() => onSelect(container.id)}
          className={`w-full rounded-lg px-4 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground ${
            selectedId === container.id ? 'bg-accent text-accent-foreground' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <Circle className={`h-3 w-3 ${container.state === 'running' ? 'text-green-500' : 'text-yellow-500'}`} />
            <span className="font-medium">{container.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

interface ContainerDetailsProps {
  containerId: string
}

const ContainerDetails: React.FC<ContainerDetailsProps> = ({ containerId }) => {
  const { data: container, isLoading } = useContainer(containerId);
  const containerAction = useContainerAction();

  if (isLoading || !container) {
    return <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>;
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

const Docker = () => {
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null)
  const { data: dockerStats, isLoading, error } = useDockerStats()

  const handleContainerSelect = useCallback((id: string) => {
    setSelectedContainer(id)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load Docker information</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Docker</h2>
        <Button>
          <Box className="mr-2 h-4 w-4" />
          New Container
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <StatusPill count={12} label="Running" color="success" />
              <StatusPill count={3} label="Stopped" color="warning" />
              <StatusPill count={1} label="Error" color="error" />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                <span>{dockerStats?.images} Images</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                <span>{dockerStats?.volumes} Volumes</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                <span>5 Networks</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4" />
                <span>24 MB/s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="containers" className="flex-1">
        <TabsList>
          <TabsTrigger value="containers">Containers</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="volumes">Volumes</TabsTrigger>
          <TabsTrigger value="networks">Networks</TabsTrigger>
        </TabsList>

        <TabsContent value="containers" className="mt-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <ContainerList onSelect={handleContainerSelect} selectedId={selectedContainer} />
            </div>
            <div className="col-span-9">
              {selectedContainer ? (
                <ContainerDetails containerId={selectedContainer} />
              ) : (
                <div className="flex h-[400px] items-center justify-center rounded-lg border">
                  <p className="text-sm text-muted-foreground">Select a container to view details</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images">
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Image management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="volumes">
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Volume management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="networks">
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Network management coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Docker