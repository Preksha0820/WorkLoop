import prisma from '../prisma.js';
import { Role } from '@prisma/client';


const getAllEmployees = async (req, res) => {
    try {
      const employees = await prisma.user.findMany({ where: { role: Role.EMPLOYEE } });
      res.status(200).json(employees);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching employees' });
    }

};


export {
    getAllEmployees
}
  