export interface Service {
  id: string;
  name: string;
  type: 'app' | 'system' | 'database' | 'monitoring';
  status: 'running' | 'stopped' | 'error';
  portMapping: Array<{
    internal: number;
    external: number;
    protocol: 'tcp' | 'udp';
  }>;
  env?: Record<string, string>;
  volumes?: Array<{
    source: string;
    target: string;
  }>;
  dependencies?: string[];
  memory?: number;
  cpu?: number;
  uptime?: string;
  category?: ServiceCategory;
}

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  uptime?: string;
  memory?: number;
  cpu?: number;
}

export interface GroupedServices {
  [key: string]: {
    name: string;
    services: Service[];
  };
}