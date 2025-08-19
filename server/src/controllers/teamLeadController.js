import prisma from '../prisma.js';
import bcrypt from 'bcryptjs';
import pkg from '@prisma/client';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
const { PrismaClient, Role } = pkg;

//Get all employees for team lead
const getAllEmployees = async (req, res) => {
  try {
    const teamLeadId = req.user.id;

    const employees = await prisma.user.findMany({
      where: {
        role: 'EMPLOYEE',
        teamLeadId: teamLeadId,
        companyId: req.user.companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    res.status(200).json({employees});
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
        teamLeadId: teamLeadId,
        companyId: req.user.companyId,
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
      where: { assignedById: teamLeadId , assignedBy: { companyId: req.user.companyId }},
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
    res.status(200).json({tasks});
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Failed to fetch assigned tasks" });
  }
};

//get all team reports
const getAllTeamReports = async (req, res) => {
  try {
    const teamLeadId = req.user.id;

    // Find all reports by employees assigned to this team lead
    const reports = await prisma.report.findMany({
      where: {
        user: {
          teamLeadId: teamLeadId
        }
      },
      include: {
        user: true,    // include employee details
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({ reports });
  } catch (err) {
    console.error("Error fetching team reports:", err);
    res.status(500).json({ message: "Failed to fetch team reports" });
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

    if (!employee || employee.role !== Role.EMPLOYEE || employee.companyId !== req.user.companyId) {
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

// Get logged-in team lead profile
const getProfile = async (req, res) => {
  try {
    const teamLead = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,   
        company: {         
          select: {
            name: true
          }
        }
      }
    });
    if (!teamLead) {
      return res.status(404).json({ message: "Team Lead not found" });
    }
    res.json(teamLead);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    res.json(updated);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

//forget password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: 'New passwords do not match' });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  res.json({ message: 'Password changed successfully' });
};

//theme preference
export const updateThemePreference = async (req, res) => {
  const { theme } = req.body;

  if (!['light', 'dark'].includes(theme)) {
    return res.status(400).json({ message: 'Invalid theme selected' });
  }

  await prisma.user.update({
    where: { id: req.user.id },
    data: { themePreference: theme },
  });

  res.json({ message: 'Theme preference updated', theme });
};

// Invite employee function
const inviteEmployee = async (req, res) => {
  try {
    const { email } = req.body;
    const teamLeadId = req.user.id;
   

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Get team lead info for email
    const teamLead = await prisma.user.findUnique({
      where: { id: teamLeadId },
      select: { name: true, email: true ,companyId:true}
    });
    
    // Get company info
    const company = await prisma.company.findUnique({
      where: { id: teamLead.companyId },
      select: { name: true }
    });

    // Create invitation token with company and team lead info
    const invitationData = {
      email,
      companyId:teamLead.companyId,
      teamLeadId,
      companyName: company.name,
      teamLeadName: teamLead.name,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
    };

    const invitationToken = jwt.sign(invitationData, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Create signup link
      const baseUrl = process.env.CORS_ORIGIN || req.headers.origin;

      const signupLink = `${baseUrl}/auth?invite=${invitationToken}&email=${encodeURIComponent(email)}`;
    

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `You're invited to join ${company.name} on WorkLoop`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">WorkLoop Invitation</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">You've been invited to join our team!</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              <strong>${teamLead.name}</strong> has invited you to join <strong>${company.name}</strong> on WorkLoop.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              WorkLoop is a powerful platform for team collaboration, task management, and productivity tracking.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${signupLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              This invitation will expire in 1 day. If you have any questions, please contact your team lead.
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p style="margin: 0; font-size: 14px;">
              © 2024 WorkLoop. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'Invitation sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ 
      message: 'Failed to send invitation',
      error: error.message 
    });
  }
};


export {
    getAllEmployees,
    assignTaskToEmployee,
    deleteEmployeeById,
    getAllAssignedTasks,
    getAllTeamReports,
    getProfile,
    updateProfile,
    changePassword,
    inviteEmployee,
}
  