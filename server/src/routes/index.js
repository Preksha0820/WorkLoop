import express from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import teamLeadRoutes from './teamLeadRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import chatRoutes from './chatRoutes.js';

const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/teamlead', teamLeadRoutes);
router.use('/api/employee', employeeRoutes);
router.use("/api/chat",chatRoutes);

export default router;
