import { DockerStats } from '@server-dashboard/types';
import { Router } from 'express';
import { getDockerStats } from '../services/docker';

export const dockerRouter: Router = Router();

dockerRouter.get('/stats', async (req, res) => {
  try {
    const stats: DockerStats = await getDockerStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching docker stats:', error);
    res.status(500).json({ error: 'Failed to fetch docker statistics' });
  }
});