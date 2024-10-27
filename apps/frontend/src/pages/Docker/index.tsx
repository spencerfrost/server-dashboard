// frontend/src/pages/Docker/index.tsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDockerStats } from '@/hooks/useDocker';
import { AlertCircle, Box } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ContainerDetails } from './components/ContainerDetails';
import { ContainerList } from './components/ContainerList';
import { DockerStats } from './components/DockerStats';

const Docker = () => {
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const { isLoading, error } = useDockerStats();

  const handleContainerSelect = useCallback((id: string) => {
    setSelectedContainer(id);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load Docker information</AlertDescription>
      </Alert>
    );
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

      <DockerStats />

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
              <ContainerList 
                onSelect={handleContainerSelect} 
                selectedId={selectedContainer} 
              />
            </div>
            <div className="col-span-9">
              {selectedContainer ? (
                <ContainerDetails containerId={selectedContainer} />
              ) : (
                <div className="flex h-[400px] items-center justify-center rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    Select a container to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images">
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">
              Image management coming soon...
            </p>
          </div>
        </TabsContent>

        <TabsContent value="volumes">
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">
              Volume management coming soon...
            </p>
          </div>
        </TabsContent>

        <TabsContent value="networks">
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">
              Network management coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Docker;