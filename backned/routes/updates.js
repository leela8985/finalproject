import express from 'express';

const router = express.Router();

// Basic health endpoint for updates routes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Updates route placeholder' });
});

export default router;
