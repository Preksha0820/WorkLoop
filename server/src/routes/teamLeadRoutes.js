import express from 'express';
import { protect , authorizeRoles} from '../middlewares/authMiddleware.js';
import { getAllEmployees ,assignTaskToEmployee,
    getAllAssignedTasks,deleteEmployeeById,
    getAllTeamReports,getProfile,
    updateProfile,
    changePassword,
    updateThemePreference,
    inviteEmployee
}  from '../controllers/teamLeadController.js';

const router = express.Router();

router.route('/employees').get(protect ,authorizeRoles('TEAM_LEAD'), getAllEmployees);
router.route('/task-assign/:assignedToId').post(protect, authorizeRoles('TEAM_LEAD'), assignTaskToEmployee);
router.route("/assigned-tasks").get(protect, authorizeRoles('TEAM_LEAD'), getAllAssignedTasks);
router.route('/delete-employee/:id').delete(protect, authorizeRoles('TEAM_LEAD','ADMIN'), deleteEmployeeById);
router.route('/invite-employee').post(protect, authorizeRoles('TEAM_LEAD'), inviteEmployee);
router.route('/team-reports').get(protect, authorizeRoles('TEAM_LEAD'), getAllTeamReports);
router.get('/profile', protect, authorizeRoles('TEAM_LEAD'), getProfile);
router.put('/profile', protect, authorizeRoles('TEAM_LEAD'), updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/theme', protect, updateThemePreference);


export default router;