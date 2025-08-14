import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { fileBridgeService } from '../services/fileBridge';

const router = Router();

router.get('/list', authenticateToken(), async (req, res) => {
  try {
    const { sub } = req.query;
    const files = await fileBridgeService.listFiles(sub as string);
    res.json(files);
  } catch (error) {
    console.error('Error listing files:', error);
    
    if (error instanceof Error && error.message === 'bridge_down') {
      return res.status(502).json({ error: 'bridge_down' });
    }
    
    res.status(500).json({ error: 'Failed to list files' });
  }
});

router.get('/download', authenticateToken(), async (req, res) => {
  try {
    const { path } = req.query;
    
    if (!path) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }

    const stream = await fileBridgeService.downloadFile(path as string);
    
    // Set appropriate headers for file download
    const filename = (path as string).split('/').pop() || 'download';
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    stream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    
    if (error instanceof Error && error.message === 'bridge_down') {
      return res.status(502).json({ error: 'bridge_down' });
    }
    
    res.status(500).json({ error: 'Failed to download file' });
  }
});

export default router;