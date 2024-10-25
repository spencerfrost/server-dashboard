import { DockerStats, NetworkInfo, ServiceStatus, SystemInfo } from '@server-dashboard/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3021';

export async function apiRequest<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    console.debug('API_BASE_URL:', API_BASE_URL);

    // Log response details for debugging
    console.debug(`API Response for ${endpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    // Handle 304 Not Modified - return the cached data
    if (response.status === 304) {
      // React Query will handle the caching, just return null to use cached data
      return null as T;
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to fetch ${endpoint}`);
    }

    const data = await response.json();
    console.debug(`API Data for ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
}

// API endpoint functions with error handling
export const fetchSystemInfo = async (): Promise<SystemInfo> => {
  try {
    return await apiRequest('/api/system');
  } catch (error) {
    console.error('Failed to fetch system info:', error);
    throw error;
  }
};

export const fetchDockerStats = async (): Promise<DockerStats> => {
  try {
    return await apiRequest('/api/docker/stats');
  } catch (error) {
    console.error('Failed to fetch docker stats:', error);
    throw error;
  }
};

export const fetchNetworkInfo = async (): Promise<NetworkInfo> => {
  try {
    return await apiRequest('/api/network');
  } catch (error) {
    console.error('Failed to fetch network info:', error);
    throw error;
  }
};

export const fetchServiceStatus = async (): Promise<ServiceStatus[]> => {
  try {
    return await apiRequest('/api/services/status');
  } catch (error) {
    console.error('Failed to fetch service status:', error);
    throw error;
  }
};