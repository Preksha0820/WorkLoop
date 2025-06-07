import express from 'express';
import { protect , authorizeRoles} from '../middlewares/authMiddleware.js';
import { getAllEmployees ,assignTaskToEmployee} from '../controllers/teamLeadController.js';

const router = express.Router();

router.route('/employees').get(protect ,authorizeRoles('TEAM_LEAD'), getAllEmployees);
router.route('/task-assign/:assignedToId').post(protect, authorizeRoles('TEAM_LEAD'), assignTaskToEmployee);

export default router;