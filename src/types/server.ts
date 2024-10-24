// src/types/server.ts
export interface SystemInfo {
  os: string;
  cpu: string;
  ram: number;
}

export interface DockerStats {
  containers: number;
  images: number;
  volumes: number;
}

export interface NetworkInfo {
  dockerNetworks: number;
  vpnStatus: string;
  proxyStatus: string;
}

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  memory: number;
  cpu: number;
}