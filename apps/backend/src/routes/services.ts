import { Router } from 'express';
import { ServiceMonitor } from '../services/serviceMonitor';

export const servicesRouter: Router = Router();
const serviceMonitor = new ServiceMonitor();

servicesRouter.get('/', async (req, res) => {
  try {
    const filter = req.query.filter as 'all' | 'critical' | 'docker' | 'system' || 'all';
    const detail = req.query.detail as 'full' | 'status' || 'full';

    const services = await serviceMonitor.getServices(filter, detail);
    res.json(services);
  } catch (error) {
    console.error('Error in /services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

servicesRouter.options('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});