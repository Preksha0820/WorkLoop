import prisma from '../prisma.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/auth.js';
import { Role } from '@prisma/client';

export const signup = async (req, res) => {
  let { name, email, password, role, teamLeadId } = req.body;

  try {
    
    const inputRole = role?.toUpperCase();
    if (!Object.values(Role).includes(inputRole)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    if (inputRole === 'TEAM_LEAD' && teamLeadId) {
      return res.status(400).json({ message: 'Team lead should not have a teamLeadId' });
    }

    if (inputRole === 'EMPLOYEE' && !teamLeadId) {
      return res.status(400).json({ message: 'Employee must have a teamLeadId' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role[inputRole],
        teamLeadId: inputRole === 'EMPLOYEE' ? parseInt(teamLeadId) : null,
      },
    });

  
    res.status(201).json({ user });

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
