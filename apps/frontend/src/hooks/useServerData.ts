import { apiRequest } from '@/lib/api';
import { DockerStats, NetworkInfo, Service, ServiceStatus, SystemInfo } from '@server-dashboard/types';
import { UseQueryResult, useQuery } from '@tanstack/react-query';


export function useServices(filter: 'all' | 'critical' | 'docker' | 'system', detail: 'full' | 'status'): UseQueryResult<(Service | ServiceStatus)[], Error> {
  return useQuery<(Service | ServiceStatus)[], Error>({
    queryKey: ['services', filter, detail],
    queryFn: () => apiRequest<(Service | ServiceStatus)[]>(`/api/services?filter=${filter}&detail=${detail}`),
    refetchInterval: 30000,
  });
}

export function useServiceStatus(): UseQueryResult<ServiceStatus[], Error> {
  return useQuery<ServiceStatus[], Error>({
    queryKey: ['serviceStatus'],
    queryFn: () => apiRequest<ServiceStatus[]>('/api/services/status'),
    refetchInterval: 15000,
  })
}

export function useSystemInfo(): UseQueryResult<SystemInfo, Error> {
  return useQuery<SystemInfo, Error>({
    queryKey: ['systemInfo'],
    queryFn: () => apiRequest<SystemInfo>('/api/system'),
    refetchInterval: 60000,
  })
}

export function useDockerStats(): UseQueryResult<DockerStats, Error> {
  return useQuery<DockerStats, Error>({
    queryKey: ['dockerStats'],
    queryFn: () => apiRequest<DockerStats>('/api/docker/stats'),
    refetchInterval: 30000,
  })
}

export function useNetworkInfo(): UseQueryResult<NetworkInfo, Error> {
  return useQuery<NetworkInfo, Error>({
    queryKey: ['networkInfo'],
    queryFn: () => apiRequest<NetworkInfo>('/api/network'),
    refetchInterval: 30000,
  })
}