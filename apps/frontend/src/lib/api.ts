import { DockerStats, NetworkInfo, ServiceStatus, SystemInfo } from '@server-dashboard/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3021';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, string | number>;
  body?: unknown;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  try {
    const { method = 'GET', params, body } = options;
    
    // Add query parameters if they exist
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    // Handle 304 Not Modified - return the cached data
    if (response.status === 304) {
      return null as T;
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Failed to fetch ${endpoint}`);
    }

    const data = await response.json();
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