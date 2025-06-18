import express from 'express';
import { getAssignedTasks, submitReport, getAllReports,reportStats,
  editReport, deleteReport, getTaskById, upload } from '../controllers/employeeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/tasks', protect, getAssignedTasks);                     // Get all tasks assigned to logged-in employee
router.get('/tasks/:id', protect, getTaskById);                      // Get specific task details
router.post('/report', protect, upload.single('file'), submitReport); // Submit a daily report with optional file
router.get('/reports', protect, getAllReports);                      // Get all reports submitted by employee
router.put('/report/:reportId', protect, editReport);                // Edit a report (if PENDING)
router.get('/report-stats', protect, reportStats);
router.delete('/report/:reportId', protect, deleteReport);           // Delete a report


export default router;
