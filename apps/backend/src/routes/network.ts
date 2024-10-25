import { NetworkInfo } from '@server-dashboard/types';
import { Router } from 'express';

export const networkRouter: Router = Router();

networkRouter.get('/', async (req, res) => {
  try {
    // For now, returning mock data - replace with real implementation later
    const networkInfo: NetworkInfo = {
      dockerNetworks: 5, // Replace with actual Docker network count
      vpnStatus: 'Connected',
      proxyStatus: 'Active'
    };
    res.json(networkInfo);
  } catch (error) {
    console.error('Error fetching network info:', error);
    res.status(500).json({ error: 'Failed to fetch network information' });
  }
});