import { SystemInfo } from '@server-dashboard/types';
import os from 'os';

export async function getSystemInfo(): Promise<SystemInfo> {
  return {
    os: `${os.type()} ${os.release()}`,
    cpu: os.cpus()[0].model,
    ram: Math.round(os.totalmem() / (1024 * 1024 * 1024)) // Convert to GB
  };
}