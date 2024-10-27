export interface Service {
  id: string;
  name: string;
  type: "system" | "app";
  status: "running" | "stopped" | "error";
  portMapping: Array<{
    internal: number;
    external: number;
    protocol: "tcp" | "udp";
  }>;
  volumes: Array<{ source: string; target: string }>;
  env: Record<string, string>;
  dependencies: string[];
  resources?: {
    cpu: number;
    memory: number;
  };
  uptime?: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface ServiceStatus {
  name: string;
  status: "healthy" | "warning" | "error";
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
