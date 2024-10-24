export interface Service {
  id: string
  name: string
  type: 'app' | 'system' | 'database' | 'monitoring'
  status: 'running' | 'stopped' | 'error'
  portMapping: Array<{
    internal: number
    external: number
    protocol: 'tcp' | 'udp'
  }>
  env?: Record<string, string>
  volumes?: Array<{
    source: string
    target: string
  }>
  dependencies?: string[]
}

export interface ServiceLog {
  timestamp: Date
  level: 'info' | 'warn' | 'error'
  message: string
  metadata?: Record<string, unknown>
}
