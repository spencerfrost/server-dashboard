// src/types/server.ts
export interface SystemInfo {
  os: string;
  cpu: string;
  ram: number;
}

export interface NetworkInfo {
  dockerNetworks: number;
  vpnStatus: string;
  proxyStatus: string;
}