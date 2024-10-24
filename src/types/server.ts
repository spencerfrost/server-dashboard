export interface SystemInfo {
  hostname: string
  os: string
  uptime: string
  users: number
  loadAverage: number[]
}

export interface HardwareInfo {
  cpu: string
  memory: {
    total: number
    used: number
    free: number
    available: number
  }
  disk: {
    total: number
    used: number
    free: number
    usedPercentage: number
  }
}

export interface ServiceStatus {
  name: string
  status: 'healthy' | 'warning' | 'error'
  uptime: string
  memory: number
  cpu: number
}

export interface DockerInfo {
  version: string
  containers: {
    total: number
    running: number
    paused: number
    stopped: number
  }
  images: number
  volumes: {
    total: number
    named: number
    unnamed: number
  }
}
