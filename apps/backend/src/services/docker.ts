import { DockerStats } from '@server-dashboard/types';
import { execSync } from 'child_process';

export async function getDockerStats(): Promise<DockerStats> {
  try {
    // Get container count
    const containers = parseInt(
      execSync('docker ps -q | wc -l').toString().trim()
    );

    // Get image count
    const images = parseInt(
      execSync('docker images -q | wc -l').toString().trim()
    );

    // Get volume count
    const volumes = parseInt(
      execSync('docker volume ls -q | wc -l').toString().trim()
    );

    return {
      containers,
      images,
      volumes
    };
  } catch (error) {
    console.error('Error executing docker commands:', error);
    throw new Error('Failed to fetch docker statistics');
  }
}