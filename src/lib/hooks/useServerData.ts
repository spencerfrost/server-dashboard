import { DockerStats, NetworkInfo, ServiceStatus, SystemInfo } from '@/types/server';
import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// API functions
async function fetchSystemInfo(): Promise<SystemInfo> {
  const response = await fetch(`${API_BASE_URL}/api/system`);
  if (!response.ok) throw new Error('Failed to fetch system info');
  return response.json();
}

async function fetchDockerStats(): Promise<DockerStats> {
  const response = await fetch(`${API_BASE_URL}/api/docker/stats`);
  if (!response.ok) throw new Error('Failed to fetch docker stats');
  return response.json();
}

async function fetchNetworkInfo(): Promise<NetworkInfo> {
  const response = await fetch(`${API_BASE_URL}/api/network`);
  if (!response.ok) throw new Error('Failed to fetch network info');
  return response.json();
}

async function fetchServiceStatus(): Promise<ServiceStatus[]> {
  const response = await fetch(`${API_BASE_URL}/api/services/status`);
  if (!response.ok) throw new Error('Failed to fetch service status');
  return response.json();
}

// Hooks
export function useSystemInfo() {
  return useQuery({
    queryKey: ['systemInfo'],
    queryFn: fetchSystemInfo,
    refetchInterval: 60000, // 1 minute
  });
}

export function useDockerStats() {
  return useQuery({
    queryKey: ['dockerStats'],
    queryFn: fetchDockerStats,
    refetchInterval: 30000, // 30 seconds
  });
}

export function useNetworkInfo() {
  return useQuery({
    queryKey: ['networkInfo'],
    queryFn: fetchNetworkInfo,
    refetchInterval: 30000, // 30 seconds
  });
}

export function useServiceStatus() {
  return useQuery<ServiceStatus[]>({
    queryKey: ['serviceStatus'],
    queryFn: fetchServiceStatus,
    refetchInterval: 15000, // 15 seconds
  });
}