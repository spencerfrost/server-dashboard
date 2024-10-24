export interface MetricData {
  timestamp: string
  value: number
}

export interface SystemMetrics {
  cpu: MetricData[]
  memory: MetricData[]
  disk: MetricData[]
  network: MetricData[]
}

export interface ContainerMetrics {
  id: string
  name: string
  cpu: MetricData[]
  memory: MetricData[]
  network: {
    rx_bytes: MetricData[]
    tx_bytes: MetricData[]
  }
}
