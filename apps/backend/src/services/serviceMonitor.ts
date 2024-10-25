import { Service, ServiceStatus } from '@server-dashboard/types';
import { exec } from 'child_process';
import Docker from 'dockerode';
import { promisify } from 'util';

const execAsync = promisify(exec);
const docker = new Docker();

interface ServiceCategory {
  id: string;
  name: string;
  services: string[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'web',
    name: 'Web Services',
    services: ['nginx', 'apache2']
  },
  {
    id: 'database',
    name: 'Databases',
    services: ['postgresql', 'mariadb', 'mysql', 'redis-server']
  },
  {
    id: 'network',
    name: 'Networking',
    services: ['NetworkManager', 'systemd-networkd', 'networkd-dispatcher', 'ssh', 'tailscaled', 'openvpn']
  },
  {
    id: 'security',
    name: 'Security',
    services: ['ufw', 'apparmor', 'auditd', 'fail2ban', 'systemd-logind', 'polkit']
  },
  {
    id: 'container',
    name: 'Containerization',
    services: ['docker', 'containerd', 'lxc']
  },
  {
    id: 'storage',
    name: 'Storage',
    services: ['zfs-mount', 'zfs-share', 'zfs-volume-wait', 'zfs-zed']
  },
  {
    id: 'core',
    name: 'Core System',
    services: ['cron', 'dbus', 'systemd-journald', 'systemd-resolved', 'systemd-timesyncd']
  }
];

export class ServiceMonitor {
  private getCategoryForService(serviceName: string): string {
    // Remove common suffixes for matching
    const cleanName = serviceName.replace(/\.(service|socket)$/, '');
    
    // Find matching category
    for (const category of SERVICE_CATEGORIES) {
      if (category.services.some(service => cleanName.includes(service))) {
        return category.id;
      }
    }
    
    // Default categorization rules
    if (cleanName.startsWith('systemd-')) {
      return 'core';
    }
    
    return 'other';
  }

  private getCategoryName(categoryId: string): string {
    return SERVICE_CATEGORIES.find(cat => cat.id === categoryId)?.name || 'Other Services';
  }

  async getServices(filter: 'all' | 'critical' | 'docker' | 'system', detail: 'full' | 'status'): Promise<(Service | ServiceStatus)[]> {
    try {
      let services: Service[] = [];

      if (filter === 'all' || filter === 'docker') {
        services = services.concat(await this.getDockerServices());
      }

      if (filter === 'all' || filter === 'system' || filter === 'critical') {
        services = services.concat(await this.getSystemServices(filter === 'critical'));
      }

      // Add category information to services
      const servicesWithCategories = services.map(service => ({
        ...service,
        category: {
          id: this.getCategoryForService(service.name),
          name: this.getCategoryName(this.getCategoryForService(service.name))
        }
      }));

      if (detail === 'status') {
        return this.getServiceStatuses(servicesWithCategories);
      }

      return servicesWithCategories;
    } catch (error) {
      console.error('Error getting services:', error);
      return [];
    }
  }

  private async getServiceStatuses(services: Service[]): Promise<ServiceStatus[]> {
    const statusPromises = services.map(async service => ({
      name: service.name,
      status: this.mapToHealthStatus(service.status),
      uptime: await this.getServiceUptime(service),
      memory: await this.getServiceMemory(service),
      cpu: await this.getServiceCpu(service)
    }));

    return await Promise.all(statusPromises);
  }

  private async getDockerServices(): Promise<Service[]> {
    try {
      const containers = await docker.listContainers({ all: true });

      const servicesPromises = containers.map(async container => {
        try {
          const inspect = await docker.getContainer(container.Id).inspect();

          const service: Service = {
            id: container.Id,
            name: container.Names[0].replace(/^\//, ''),
            type: 'app',
            status: this.mapDockerState(container.State),
            portMapping: this.parseDockerPorts(container.Ports),
            env: this.parseDockerEnv(inspect.Config.Env),
            volumes: this.parseDockerMounts(inspect.Mounts),
            dependencies: this.parseDockerLinks(inspect.HostConfig.Links)
          };
          return service;
        } catch (error) {
          console.error(`Error inspecting container ${container.Id}:`, error);
          return null;
        }
      });

      const services = await Promise.all(servicesPromises);
      return services.filter((service): service is Service => service !== null);
    } catch (error) {
      console.error('Error getting docker services:', error);
      return [];
    }
  }

  private async getSystemServices(criticalOnly: boolean = false): Promise<Service[]> {
    const criticalServices = [
      'nginx',
      'postgresql',
      'docker',
      'ssh',
      'ufw',
      'cron',
      'fail2ban'
    ];
  
    const allServices = criticalOnly ? criticalServices : await this.getAllSystemServices();
  
    const servicePromises = allServices.map(async serviceName => {
      const isRunning = await this.getSystemServiceStatus(serviceName);
      const service: Service = {
        id: serviceName,
        name: serviceName,
        type: 'system',
        status: isRunning ? 'running' : 'stopped',
        portMapping: this.getServicePorts(serviceName),
        volumes: [],
        env: {},
        dependencies: []
      };
      return service;
    });
  
    return Promise.all(servicePromises);
  }

  private async getAllSystemServices(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('systemctl list-units --type=service --all --no-pager --no-legend --plain');
      const services = stdout.split('\n').map(line => line.split(/\s+/)[0]).filter(Boolean);
      return services;
    } catch (error) {
      console.error('Error getting all system services:', error);
      return [];
    }
  }

  private async getSystemServiceStatus(service: string): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`systemctl is-active ${service}`);
      return stdout.trim() === 'active';
    } catch {
      return false;
    }
  }

  private async getServiceUptime(service: Service): Promise<string> {
    try {
      if (service.type === 'system') {
        try {
          const { stdout } = await execAsync(`systemctl show ${service.name} --property=ActiveEnterTimestamp`);
          const timestamp = stdout.split('=')[1]?.trim();
          if (!timestamp) return 'Unknown';
          return this.formatUptime(timestamp);
        } catch {
          return 'Unknown';
        }
      }

      if (service.type === 'app') {
        try {
          const { stdout } = await execAsync(`docker inspect --format='{{.State.StartedAt}}' ${service.id}`);
          return this.formatUptime(stdout.trim());
        } catch {
          return 'Unknown';
        }
      }

      return 'Unknown';
    } catch (error) {
      console.error(`Error getting uptime for service ${service.name}:`, error);
      return 'Unknown';
    }
  }

  private async getServiceMemory(service: Service): Promise<number> {
    try {
      if (service.type === 'system') {
        try {
          const { stdout: pidOutput } = await execAsync(`pidof ${service.name}`);
          const pid = pidOutput.trim();
          if (!pid) return 0;

          const { stdout: memOutput } = await execAsync(`ps -o rss= -p ${pid}`);
          return parseInt(memOutput.trim()) / 1024; // Convert KB to MB
        } catch {
          return 0;
        }
      }

      if (service.type === 'app') {
        try {
          const { stdout } = await execAsync(`docker stats ${service.id} --no-stream --format "{{.MemUsage}}"`);
          const memoryStr = stdout.trim();
          const usedMemory = memoryStr.split('/')[0].trim();
          const memoryValue = parseFloat(usedMemory);

          if (usedMemory.includes('GiB')) {
            return memoryValue * 1024;
          } else if (usedMemory.includes('KiB')) {
            return memoryValue / 1024;
          }
          return memoryValue; // Already in MiB
        } catch {
          return 0;
        }
      }

      return 0;
    } catch (error) {
      console.error(`Error getting memory for service ${service.name}:`, error);
      return 0;
    }
  }

  private async getServiceCpu(service: Service): Promise<number> {
    try {
      if (service.type === 'system') {
        try {
          const { stdout: pidOutput } = await execAsync(`pidof ${service.name}`);
          const pid = pidOutput.trim();
          if (!pid) return 0;

          const { stdout: cpuOutput } = await execAsync(`ps -o %cpu= -p ${pid}`);
          return parseFloat(cpuOutput.trim());
        } catch {
          return 0;
        }
      }

      if (service.type === 'app') {
        try {
          const { stdout } = await execAsync(`docker stats ${service.id} --no-stream --format "{{.CPUPerc}}"`);
          return parseFloat(stdout.toString().replace('%', '').trim()) || 0;
        } catch {
          return 0;
        }
      }

      return 0;
    } catch (error) {
      console.error(`Error getting CPU for service ${service.name}:`, error);
      return 0;
    }
  }

  // Helper methods that don't need to be async
  private mapToHealthStatus(status: string): 'healthy' | 'warning' | 'error' {
    switch (status) {
      case 'running':
        return 'healthy';
      case 'stopped':
        return 'warning';
      default:
        return 'error';
    }
  }

  private parseDockerPorts(ports: Docker.Port[]): Service['portMapping'] {
    return ports.map(port => ({
      internal: port.PrivatePort,
      external: port.PublicPort || port.PrivatePort,
      protocol: port.Type.toLowerCase() as 'tcp' | 'udp'
    }));
  }

  private parseDockerEnv(env: string[]): Record<string, string> {
    return env.reduce((acc: Record<string, string>, curr: string) => {
      const [key, ...values] = curr.split('=');
      acc[key] = values.join('=');
      return acc;
    }, {});
  }

  private parseDockerMounts(mounts: Docker.ContainerInspectInfo['Mounts']): Service['volumes'] {
    return mounts.map(mount => ({
      source: mount.Source,
      target: mount.Destination
    }));
  }

  private parseDockerLinks(links: string[] | null): string[] {
    if (!links) return [];
    return links.map(link => link.split(':')[0].replace(/^\//, ''));
  }

  private getServicePorts(service: string): Service['portMapping'] {
    const portMap: Record<string, Array<{ internal: number; protocol: 'tcp' | 'udp' }>> = {
      nginx: [{ internal: 80, protocol: 'tcp' }, { internal: 443, protocol: 'tcp' }],
      postgresql: [{ internal: 5432, protocol: 'tcp' }],
      ssh: [{ internal: 22, protocol: 'tcp' }]
    };

    return (portMap[service] || []).map(port => ({
      ...port,
      external: port.internal
    }));
  }

  private mapDockerState(state: string): 'running' | 'stopped' | 'error' {
    switch (state.toLowerCase()) {
      case 'running':
        return 'running';
      case 'exited':
      case 'stopped':
        return 'stopped';
      default:
        return 'error';
    }
  }

  private formatUptime(timestamp: string): string {
    try {
      const start = new Date(timestamp);
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      return `${days}d ${hours}h`;
    } catch {
      return 'Unknown';
    }
  }
}