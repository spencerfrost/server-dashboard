import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDockerStats, useNetworkInfo, useServiceStatus, useSystemInfo } from '@/hooks/useServerData';
import { AlertCircle } from 'lucide-react';
import React from 'react';

interface StatusBadgeProps {
  status: 'healthy' | 'warning' | 'error';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-full text-sm ${
      status === 'healthy'
        ? 'bg-green-100 text-green-800'
        : status === 'warning'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800'
    }`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const LoadingCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-gray-600">
        <Skeleton className="h-4 w-24" />
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-24" />
    </CardContent>
  </Card>
);

const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const Overview: React.FC = () => {
  const systemInfo = useSystemInfo();
  const dockerStats = useDockerStats();
  const networkInfo = useNetworkInfo();
  const serviceStatus = useServiceStatus();

  const isLoading = systemInfo.isLoading || dockerStats.isLoading || networkInfo.isLoading || serviceStatus.isLoading;
  const hasError = systemInfo.isError || dockerStats.isError || networkInfo.isError || serviceStatus.isError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-4">
        {systemInfo.isError && <ErrorAlert message="Failed to load system information" />}
        {dockerStats.isError && <ErrorAlert message="Failed to load Docker statistics" />}
        {networkInfo.isError && <ErrorAlert message="Failed to load network information" />}
        {serviceStatus.isError && <ErrorAlert message="Failed to load service status" />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">System Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{systemInfo.data?.os}</p>
            <p>{systemInfo.data?.cpu}</p>
            <p>{systemInfo.data?.ram}GB RAM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">Docker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{dockerStats.data?.containers} Running Containers</p>
            <p>{dockerStats.data?.images} Images</p>
            <p>{dockerStats.data?.volumes} Named Volumes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-gray-600">Network</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{networkInfo.data?.dockerNetworks} Docker Networks</p>
            <p>{networkInfo.data?.vpnStatus}</p>
            <p>{networkInfo.data?.proxyStatus}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Critical Services Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {serviceStatus.data?.map((service) => (
              <div key={service.name} className="flex items-center justify-between">
                <span>{service.name}</span>
                <StatusBadge status={service.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>Last documentation update: October 24, 2024 - Added new port management schema</AlertDescription>
      </Alert>
    </div>
  );
};

export default Overview;