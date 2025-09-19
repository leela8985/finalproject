import express from 'express';
import BranchPerformance from '../Models/branchPerformance.js';

const router = express.Router();

router.get('/:semester', async (req, res) => {
    try {
        const { semester } = req.params;
        
        console.log(`Fetching data for semester: ${semester}`);
        
        const performanceData = await BranchPerformance.findOne({ semester });
        
        console.log('Found performance data:', performanceData ? 'yes' : 'no');

        if (!performanceData) {
            return res.status(404).json({ 
                error: 'No data found',
                semester 
            });
        }

        res.json(performanceData);

    } catch (error) {
        console.error('Error in branch performance route:', error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router;