import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { getAllEmployeesInCompany ,getTeamLeads ,deleteTeamLeadsById , switchEmployeeTeam,  getEachEmployeeByTeam,
    changeEmployeeRole, getAdminProfile , updateAdminProfile } from '../controllers/adminController.js';

const router = express.Router();

router.route('/employees').get(protect, authorizeRoles('ADMIN'), getAllEmployeesInCompany);
router.route('/team-leads').get(protect,authorizeRoles('ADMIN'), getTeamLeads );
router.route('/team-lead/:id').delete( protect, authorizeRoles('ADMIN'), deleteTeamLeadsById);
router.route('/switch-team/:employeeId').put(protect, authorizeRoles('ADMIN'), switchEmployeeTeam);
router.route('/change-role/:employeeId').patch(protect, authorizeRoles('ADMIN'), changeEmployeeRole);
router.route('/team-groups').get(protect, authorizeRoles('ADMIN'), getEachEmployeeByTeam);
router.route('/profile')
  .get(protect, authorizeRoles('ADMIN'), getAdminProfile)
  .put(protect, authorizeRoles('ADMIN'), updateAdminProfile);


export default router;