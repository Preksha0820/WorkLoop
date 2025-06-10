import prisma from '../prisma.js';
import { Role } from '@prisma/client';
import { notifyEmployeeOnReportReview } from "../sockets/notifications.js";


//Get all employees for team lead
const getAllEmployees = async (req, res) => {
  try {
    const teamLeadId = req.user.id;

    const employees = await prisma.user.findMany({
      where: {
        role: 'EMPLOYEE',
        teamLeadId: teamLeadId
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    res.status(200).json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Error fetching employees' });
  }
};

// Asssign task to employee
const assignTaskToEmployee = async (req, res) => {
  try {
    const teamLeadId = parseInt(req.user.id);
    const { assignedToId } = req.params; 
    const { title, description, deadline } = req.body;

    // Parse ID
    const parsedAssignedToId = parseInt(assignedToId);

    // Validation
    if (!title || !description || !deadline || isNaN(parsedAssignedToId)) {
      return res.status(400).json({ message: "All fields are required and must be valid" });
    }

    // Ensure employee belongs to this team lead
    const employee = await prisma.user.findFirst({
      where: {
        id: parsedAssignedToId,
        role: 'EMPLOYEE',
        teamLeadId: teamLeadId
      }
    });

    if (!employee) {
      return res.status(403).json({ message: "You can only assign tasks to your own employees" });
    }

    // Create the task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        assignedToId: parsedAssignedToId,
        assignedById: teamLeadId
      }
    });

    res.status(201).json({ message: "Task assigned successfully", task });
  } catch (err) {
    console.error("Error assigning task:", err);
    res.status(500).json({ message: "Failed to assign task" });
  }
};

// Get all tasks assigned by this team lead
const getAllAssignedTasks = async (req, res) => {
  try {
    const teamLeadId = parseInt(req.user.id);

    const tasks = await prisma.task.findMany({
      where: { assignedById: teamLeadId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Failed to fetch assigned tasks" });
  }
};

//report review
const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;
    const teamLeadId = parseInt(req.user.id);

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const report = await prisma.report.findUnique({
      where: { id: parseInt(reportId) },
      include: {
        user: true,
      },
    });

    if (!report || report.user.teamLeadId !== teamLeadId) {
      return res.status(403).json({ message: "Not authorized to update this report" });
    }

    const updatedReport = await prisma.report.update({
      where: { id: report.id },
      data: {
        status,
      },
    });
    notifyEmployeeOnReportReview(report.userId, updatedReport);

    res.status(200).json({ message: "Report status updated", report: updatedReport });
  } catch (err) {
    console.error("Error updating report status:", err);
    res.status(500).json({ message: "Failed to update report" });
  }
};

const deleteEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = parseInt(id);

    if (isNaN(employeeId)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    // Check if employee exists and is indeed an EMPLOYEE
    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee || employee.role !== Role.EMPLOYEE) {
      return res.status(404).json({ message: 'Employee not found or not an employee' });
    }

    // Optional: Delete related reports and tasks
    await prisma.report.deleteMany({
      where: { userId: employeeId },
    });

    await prisma.task.deleteMany({
      where: { assignedToId: employeeId },
    });

    // Delete the employee
    await prisma.user.delete({
      where: { id: employeeId },
    });

    res.status(200).json({ message: 'Employee deleted successfully' });

  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ message: 'Failed to delete employee' });
  }
};

export {
    getAllEmployees,
    assignTaskToEmployee,
    updateReportStatus,
    deleteEmployeeById,
    getAllAssignedTasks,
}
  