import express from 'express';

const router = express.Router();

// Basic endpoint for materials route
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Materials route placeholder' });
});

export default router;
