import prisma from '../prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/auth.js';
import pkg from '@prisma/client';
const { PrismaClient, Role } = pkg;


export const signup = async (req, res) => {
  const { name, email, password, role, companyName, companyId, teamLeadId } = req.body;

  try {
    const inputRole = role?.toUpperCase();
    if (!Object.values(Role).includes(inputRole)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    let company;

    if (inputRole === 'ADMIN') {
      if (!companyName) return res.status(400).json({ message: 'Company name is required for admin' });

      company = await prisma.company.create({ data: { name: companyName } });
    } else {
      if (!companyId) return res.status(400).json({ message: 'companyId is required' });

      company = await prisma.company.findUnique({ where: { id: parseInt(companyId) } });
      if (!company) return res.status(404).json({ message: 'Company not found' });
    }

    if (inputRole === 'TEAM_LEAD' && teamLeadId)
      return res.status(400).json({ message: 'Team lead should not have teamLeadId' });

    if (inputRole === 'EMPLOYEE') {
      if (!teamLeadId)
        return res.status(400).json({ message: 'Employee must have a teamLeadId' });

      const lead = await prisma.user.findUnique({ where: { id: parseInt(teamLeadId) } });

      if (!lead || lead.role !== 'TEAM_LEAD' || lead.companyId !== company.id)
        return res.status(400).json({ message: 'Invalid team lead for this company' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: inputRole,
        teamLeadId: inputRole === 'EMPLOYEE' ? parseInt(teamLeadId) : null,
        companyId: company.id,
      },
    });

    res.status(201).json({ user});

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.status(200).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        company: true,
        teamLead: true,
        teamMembers: true,
      },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// Verify invitation token
export const verifyInvitation = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: 'Invitation token is required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    // Check if token is expired
    if (decoded.expiresAt && new Date(decoded.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'Invitation has expired' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: decoded.email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Return invitation data for frontend
    res.status(200).json({
      email: decoded.email,
      companyId: decoded.companyId,
      teamLeadId: decoded.teamLeadId,
      companyName: decoded.companyName,
      teamLeadName: decoded.teamLeadName
    });

  } catch (error) {
    console.error('Error verifying invitation:', error);
    res.status(400).json({ message: 'Invalid or expired invitation token' });
  }
};


