import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { plcBridgeService } from '../services/plcBridge';

const router = Router();

router.get('/status', authenticateToken(), async (req, res) => {
  try {
    const status = await plcBridgeService.getMachineStatus();
    res.json(status);
  } catch (error) {
    console.error('Error fetching machine status:', error);
    
    if (error instanceof Error && error.message === 'bridge_down') {
      return res.status(502).json({ error: 'bridge_down' });
    }
    
    res.status(500).json({ error: 'Failed to fetch machine status' });
  }
});

router.get('/events', authenticateToken(), async (req, res) => {
  try {
    const events = await plcBridgeService.getMachineEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching machine events:', error);
    
    if (error instanceof Error && error.message === 'bridge_down') {
      return res.status(502).json({ error: 'bridge_down' });
    }
    
    res.status(500).json({ error: 'Failed to fetch machine events' });
  }
});

export default router;