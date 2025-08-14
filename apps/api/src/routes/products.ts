import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { mongoService } from '../services/mongodb';

const router = Router();

router.get('/', authenticateToken(), async (req, res) => {
  try {
    const { q, profile } = req.query;
    
    const products = await mongoService.getProducts(
      q as string,
      profile as string
    );

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export default router;