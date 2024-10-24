export interface DockerContainer {
  id: string
  name: string
  image: string
  state: string
  status: string
  ports: Array<{
    privatePort: number
    publicPort: number
    type: string
  }>
  memory: {
    usage: number
    limit: number
    percentage: number
  }
  cpu: {
    usage: number
    percentage: number
  }
}

export interface DockerVolume {
  name: string
  driver: string
  mountpoint: string
  size?: number
  createdAt: string
}

export interface DockerNetwork {
  id: string
  name: string
  driver: string
  scope: string
  ipam: {
    subnet: string
    gateway: string
  }
}
