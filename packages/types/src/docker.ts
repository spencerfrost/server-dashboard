// packages/types/src/docker.ts
export interface DockerPortMapping {
  internal: number;
  external: number;
  protocol: 'tcp' | 'udp';
}

export interface DockerStats {
  containers: number;
  containersRunning: number;
  containersStopped: number;
  containersErrored: number;
  images: number;
  volumes: number;
  networks: number;
}

export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  state: 'running' | 'stopped' | 'exited' | 'error';
  status: string;
  uptime: string;
  ports: DockerPortMapping[];
  mounts: string[];
  networks: string[];
  stats: {
    cpu_percent: number;
    memory_usage: number;
    memory_limit: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
    block_read_bytes: number;
    block_write_bytes: number;
  };
}

export interface DockerVolume {
  name: string;
  driver: string;
  mountpoint: string;
  size?: number;
  createdAt: string;
}

export interface DockerNetwork {
  id: string;
  name: string;
  driver: string;
  scope: string;
  ipam: {
    subnet: string;
    gateway: string;
  };
}

export interface ContainerLogs {
  timestamp: string;
  stream: 'stdout' | 'stderr';
  message: string;
}