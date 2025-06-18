import prisma from '../prisma.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { notifyTeamLeadOnReportSubmission } from '../sockets/notifications.js';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';

// Get Assigned Tasks
export const getAssignedTasks = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);

    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: userId,
        assignedTo: { companyId: req.user.companyId }
      },
      orderBy: { deadline: 'asc' },
    });

    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// Submit Daily Work Report
export const submitReport = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const { content, taskId } = req.body;
    console.log('Received report submission:', { userId, content, taskId , file: req.file });
    // Validate required fields
    if (!content || !taskId) {  
      return res.status(400).json({ message: 'Content and taskId are required' });
    }

    // Optional: Check if the task exists and is assigned to this user
    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(taskId),
        assignedToId: userId,
      },
    });

    if (!task) {
      return res.status(403).json({ message: "Invalid task ID or task not assigned to you" });
    }

    // Handle file upload (if any)
    let fileURL = null;
    if (req.file) {
      fileURL = `/uploads/${req.file.filename}`;
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        userId,
        taskId: parseInt(taskId),
        content,
        fileURL: fileURL || null, 
      },
    });
    // Find user's team lead id to notify
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.teamLeadId) {
      notifyTeamLeadOnReportSubmission(user.teamLeadId, report);
    }

    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (err) {
    console.error('Error submitting report:', err);
    res.status(500).json({ message: 'Failed to submit report' });
  }
}

//get all submitted reports by employees
export const getAllReports = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);

    const reports = await prisma.report.findMany({
      where: { userId },
      include: {
        task: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ reports });
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

//Edit report
export const editReport = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const reportId = parseInt(req.params.reportId);
    const { content } = req.body;

    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report || report.userId !== userId) {
      return res.status(404).json({ message: 'Report not found or unauthorized' });
    }

    if (report.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only PENDING reports can be edited' });
    }

    const updated = await prisma.report.update({
      where: { id: reportId },
      data: { content },
    });

    res.status(200).json({ message: 'Report updated successfully', updated });
  } catch (err) {
    console.error('Error editing report:', err);
    res.status(500).json({ message: 'Failed to update report' });
  }
};

//delete report
export const deleteReport = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const reportId = parseInt(req.params.reportId);

    const report = await prisma.report.findUnique({ where: { id: reportId } });

    if (!report || report.userId !== userId) {
      return res.status(404).json({ message: 'Report not found or unauthorized' });
    }

    await prisma.report.delete({ where: { id: reportId } });

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('Error deleting report:', err);
    res.status(500).json({ message: 'Failed to delete report' });
  }
};

//get task detail by id
export const getTaskById = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const taskId = parseInt(req.params.id);

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        assignedToId: userId,
        assignedTo: { companyId: req.user.companyId }
      },
      include: {
        assignedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ task });
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({ message: 'Failed to fetch task' });
  }
};

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});


export const reportStats = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const now = new Date();

    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); 
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });     

    const [todayReports, weekReports] = await Promise.all([
      prisma.report.findMany({
        where: {
          userId,
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      prisma.report.findMany({
        where: {
          userId,
          createdAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      }),
    ]);

    res.status(200).json({
      todayCount: todayReports.length,
      weekCount: weekReports.length,
      todayReports,
      weekReports,
    });
  } catch (err) {
    console.error("Error fetching report stats:", err);
    res.status(500).json({ message: "Failed to fetch report stats" });
  }
};


export const upload = multer({ storage });


