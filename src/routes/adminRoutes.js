import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { getAllUsersInCompany ,getTeamLeads  } from '../controllers/adminController.js';

const router = express.Router();

router.route('/users').get(protect, authorizeRoles('ADMIN'), getAllUsersInCompany);
router.route('/team-leads').get(protect,authorizeRoles('ADMIN'), getTeamLeads );

export default router;