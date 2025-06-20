import express from 'express';
import { protect , authorizeRoles} from '../middlewares/authMiddleware.js';
import { getAllEmployees ,assignTaskToEmployee,
    getAllAssignedTasks,deleteEmployeeById,
    getAllTeamReports
}  from '../controllers/teamLeadController.js';

const router = express.Router();

router.route('/employees').get(protect ,authorizeRoles('TEAM_LEAD'), getAllEmployees);
router.route('/task-assign/:assignedToId').post(protect, authorizeRoles('TEAM_LEAD'), assignTaskToEmployee);
router.route("/assigned-tasks").get(protect, authorizeRoles('TEAM_LEAD'), getAllAssignedTasks);
router.route('/delete-employee/:id').delete(protect, authorizeRoles('TEAM_LEAD'), deleteEmployeeById);
router.route('/team-reports').get(protect, authorizeRoles('TEAM_LEAD'), getAllTeamReports);

export default router;