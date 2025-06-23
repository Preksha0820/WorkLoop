import express from 'express';
import {
  getAssignedTasks, submitReport, getAllReports, reportStats, updateTaskStatus,
  editReport, deleteReport, getTaskById, upload,
  getEmployeeProfile,
  updateEmployeeProfile,
  updateThemePreference,
  changePassword ,getTeamLead
} from '../controllers/employeeController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Middleware to protect routes and authorize employee role
router.use(protect);
router.use(authorizeRoles('EMPLOYEE'));

router.get('/tasks', getAssignedTasks);                          // Get all tasks assigned to logged-in employee
router.get('/tasks/:id', getTaskById);                           // Get specific task details
router.post('/report', upload.single('file'), submitReport);     // Submit a daily report with optional file
router.get('/reports', getAllReports);                           // Get all reports submitted by employee
router.put('/report/:reportId', editReport);                     // Edit a report (if PENDING)
router.get('/report-stats', reportStats);
router.delete('/report/:reportId', deleteReport);                 // Delete a report
router.put('/task-status/:taskId', updateTaskStatus);             // update task status
router.get('/profile', getEmployeeProfile);
router.put('/profile', updateEmployeeProfile);
router.put('/change-password' , changePassword);
router.put('/theme' , updateThemePreference);

router.get("/team-lead", getTeamLead);                             // Get team lead details for the logged-in employee

export default router;
