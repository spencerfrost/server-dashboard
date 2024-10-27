// frontend/src/hooks/useDocker.ts
import { ContainerLogs, DockerContainer, DockerStats } from '@server-dashboard/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/api';

export function useContainers() {
  return useQuery<DockerContainer[]>({
    queryKey: ['docker', 'containers'],
    queryFn: () => apiRequest('/api/docker/containers'),
    refetchInterval: 5000
  });
}

export function useContainer(id: string | null) {
  return useQuery<DockerContainer>({
    queryKey: ['docker', 'containers', id],
    queryFn: () => apiRequest(`/api/docker/containers/${id}`),
    enabled: !!id,
    refetchInterval: 2000
  });
}

export function useDockerStats() {
  return useQuery<DockerStats>({
    queryKey: ['docker', 'stats'],
    queryFn: () => apiRequest('/api/docker/stats'),
    refetchInterval: 5000
  });
}

export function useContainerLogs(containerId: string, options: { tail?: number; since?: string } = {}) {
  return useQuery<ContainerLogs[]>({
    queryKey: ['docker', 'logs', containerId, options],
    queryFn: () => apiRequest(`/api/docker/containers/${containerId}/logs`, { params: options }),
    enabled: !!containerId,
    refetchInterval: options.tail ? 2000 : false
  });
}

export function useContainerAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'start' | 'stop' | 'restart' }) =>
      apiRequest(`/api/docker/containers/${id}/${action}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['docker', 'containers'] });
      queryClient.invalidateQueries({ queryKey: ['docker', 'stats'] });
    }
  });
}