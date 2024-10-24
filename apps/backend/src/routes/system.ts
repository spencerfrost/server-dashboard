import { SystemInfo } from '@server-dashboard/types';
import { Router } from 'express';
import { getSystemInfo } from '../services/system';

export const systemRouter: Router = Router();

systemRouter.get('/', async (req, res) => {
  try {
    const systemInfo: SystemInfo = await getSystemInfo();
    res.json(systemInfo);
  } catch (error) {
    console.error('Error fetching system info:', error);
    res.status(500).json({ error: 'Failed to fetch system information' });
  }
});