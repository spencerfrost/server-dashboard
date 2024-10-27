// backend/src/routes/docker.ts
import { Router } from 'express';
import { DockerService } from '../services/docker';

export const dockerRouter: Router = Router();
const dockerService = new DockerService();

dockerRouter.get('/containers', async (req, res) => {
  try {
    const containers = await dockerService.getContainers();
    res.json(containers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch containers' });
  }
});

dockerRouter.get('/stats', async (req, res) => {
  try {
    const stats = await dockerService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Docker statistics' });
  }
});

dockerRouter.get('/containers/:id/logs', async (req, res) => {
  try {
    const logs = await dockerService.getContainerLogs(req.params.id, {
      tail: parseInt(req.query.tail as string) || 100,
      since: req.query.since as string
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch container logs' });
  }
});

dockerRouter.post('/containers/:id/:action', async (req, res) => {
  const { id, action } = req.params;
  if (!['start', 'stop', 'restart'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    await dockerService.performContainerAction(id, action as 'start' | 'stop' | 'restart');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: `Failed to ${action} container` });
  }
});