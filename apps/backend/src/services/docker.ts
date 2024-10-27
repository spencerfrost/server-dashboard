// backend/src/services/docker.ts
import { DockerContainer, DockerPortMapping, DockerStats } from '@server-dashboard/types';
import Docker from 'dockerode';

export class DockerService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  async getContainers(): Promise<DockerContainer[]> {
    try {
      const containers = await this.docker.listContainers({ all: true });
      
      const containerDetails = await Promise.all(
        containers.map(async (container) => {
          const details = await this.docker.getContainer(container.Id).inspect();
          const stats = await this.getContainerStats(container.Id);

          // Map ports with proper type handling
          const ports: DockerPortMapping[] = container.Ports.map(port => {
            const protocol = port.Type.toLowerCase();
            if (protocol !== 'tcp' && protocol !== 'udp') {
              return {
                internal: port.PrivatePort,
                external: port.PublicPort || port.PrivatePort,
                protocol: 'tcp' // Default to TCP if unknown
              };
            }
            return {
              internal: port.PrivatePort,
              external: port.PublicPort || port.PrivatePort,
              protocol
            };
          });

          const containerInfo: DockerContainer = {
            id: container.Id,
            name: container.Names[0].replace(/^\//, ''),
            image: container.Image,
            state: this.mapContainerState(details.State.Status),
            status: container.Status,
            uptime: this.calculateUptime(details.State.StartedAt),
            ports,
            mounts: details.Mounts.map(mount => mount.Source),
            networks: Object.keys(details.NetworkSettings.Networks),
            stats: {
              cpu_percent: stats.cpu_percent,
              memory_usage: stats.memory_usage,
              memory_limit: stats.memory_limit,
              network_rx_bytes: stats.network_rx_bytes,
              network_tx_bytes: stats.network_tx_bytes,
              block_read_bytes: stats.block_read_bytes,
              block_write_bytes: stats.block_write_bytes
            }
          };

          return containerInfo;
        })
      );

      return containerDetails;
    } catch (error) {
      console.error('Error fetching containers:', error);
      throw new Error('Failed to fetch container information');
    }
  }

  private mapContainerState(state: string): DockerContainer['state'] {
    switch (state.toLowerCase()) {
      case 'running':
        return 'running';
      case 'exited':
        return 'exited';
      case 'stopped':
        return 'stopped';
      default:
        return 'error';
    }
  }

  async getStats(): Promise<DockerStats> {
    try {
      const containers = await this.docker.listContainers({ all: true });
      const volumes = await this.docker.listVolumes();
      const networks = await this.docker.listNetworks();

      const runningContainers = containers.filter(c => c.State === 'running');
      const stoppedContainers = containers.filter(c => c.State === 'exited');
      const erroredContainers = containers.filter(c => !['running', 'exited'].includes(c.State));

      return {
        containers: containers.length,
        containersRunning: runningContainers.length,
        containersStopped: stoppedContainers.length,
        containersErrored: erroredContainers.length,
        images: (await this.docker.listImages()).length,
        volumes: volumes.Volumes.length,
        networks: networks.length
      };
    } catch (error) {
      console.error('Error fetching Docker stats:', error);
      throw new Error('Failed to fetch Docker statistics');
    }
  }

  async getContainerLogs(id: string, options: { tail?: number; since?: string } = {}): Promise<string[]> {
    try {
      const container = this.docker.getContainer(id);
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        tail: options.tail || 100,
        since: options.since,
        timestamps: true
      });

      return logs.toString().split('\n').filter(Boolean);
    } catch (error) {
      console.error(`Error fetching logs for container ${id}:`, error);
      throw new Error('Failed to fetch container logs');
    }
  }

  async performContainerAction(id: string, action: 'start' | 'stop' | 'restart'): Promise<void> {
    try {
      const container = this.docker.getContainer(id);
      const method = container[action] as () => Promise<void>;
      if (method) {
        await method();
      } else {
        throw new Error(`Invalid action: ${action}`);
      }
    } catch (error) {
      console.error(`Error performing ${action} on container ${id}:`, error);
      throw new Error(`Failed to ${action} container`);
    }
  }

  private async getContainerStats(id: string) {
    try {
      const container = this.docker.getContainer(id);
      const stats = await container.stats({ stream: false });
      
      const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
      const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
      const cpuPercent = (cpuDelta / systemDelta) * 100;

      return {
        cpu_percent: cpuPercent,
        memory_usage: stats.memory_stats.usage,
        memory_limit: stats.memory_stats.limit,
        network_rx_bytes: stats.networks?.eth0?.rx_bytes || 0,
        network_tx_bytes: stats.networks?.eth0?.tx_bytes || 0,
        block_read_bytes: stats.blkio_stats?.io_service_bytes_recursive?.[0]?.value || 0,
        block_write_bytes: stats.blkio_stats?.io_service_bytes_recursive?.[1]?.value || 0
      };
    } catch (error) {
      console.error(`Error fetching stats for container ${id}:`, error);
      return {
        cpu_percent: 0,
        memory_usage: 0,
        memory_limit: 0,
        network_rx_bytes: 0,
        network_tx_bytes: 0,
        block_read_bytes: 0,
        block_write_bytes: 0
      };
    }
  }

  private calculateUptime(startTime: string): string {
    const start = new Date(startTime);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  }
}