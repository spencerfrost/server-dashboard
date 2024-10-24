import { DockerStats, NetworkInfo, ServiceStatus, SystemInfo } from '@/types/server';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const fetchSystemInfo = async (): Promise<SystemInfo> => {
  const response = await fetch(`${API_BASE_URL}/api/system`);
  if (!response.ok) throw new Error('Failed to fetch system info');
  return response.json();
};

export const fetchDockerStats = async (): Promise<DockerStats> => {
  const response = await fetch(`${API_BASE_URL}/api/docker/stats`);
  if (!response.ok) throw new Error('Failed to fetch docker stats');
  return response.json();
};

export const fetchNetworkInfo = async (): Promise<NetworkInfo> => {
  const response = await fetch(`${API_BASE_URL}/api/network`);
  if (!response.ok) throw new Error('Failed to fetch network info');
  return response.json();
};

export const fetchServiceStatus = async (): Promise<ServiceStatus[]> => {
  const response = await fetch(`${API_BASE_URL}/api/services/status`);
  if (!response.ok) throw new Error('Failed to fetch service status');
  return response.json();
};