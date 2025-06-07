import prisma from '../prisma.js';
import { Role } from '@prisma/client';


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
    const { assignedToId } = req.params; // from route parameter
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


export {
    getAllEmployees,
    assignTaskToEmployee
}
  