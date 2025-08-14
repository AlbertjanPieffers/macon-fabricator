import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { mongoService } from '../services/mongodb';
import { Batch } from '../types';

const router = Router();

router.get('/', authenticateToken(), async (req, res) => {
  try {
    const batches = await mongoService.getBatches();
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ error: 'Failed to fetch batches' });
  }
});

router.post('/', authenticateToken(true), async (req, res) => {
  try {
    const { Data2, Data3, ...otherData } = req.body;

    if (!Data2 || !Data3) {
      return res.status(400).json({ 
        error: 'Data2 (batch name) and Data3 (batch contents) are required' 
      });
    }

    const batch: Omit<Batch, '_id'> = {
      Data2,
      Data3,
      ...otherData
    };

    const created = await mongoService.createBatch(batch);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ error: 'Failed to create batch' });
  }
});

router.put('/:index', authenticateToken(true), async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    
    if (isNaN(index) || index < 0 || index > 49) {
      return res.status(400).json({ 
        error: 'Index must be a number between 0 and 49' 
      });
    }

    const updates = req.body;
    const updated = await mongoService.updateBatch(index, updates);
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating batch:', error);
    res.status(500).json({ error: 'Failed to update batch' });
  }
});

export default router;