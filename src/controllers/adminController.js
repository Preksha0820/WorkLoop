import prisma from '../prisma.js';

const getAllUsersInCompany = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { companyId: req.user.companyId },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const getTeamLeads = async (req, res) => {
  try {
   
    const { companyId } = req.user;

    const teamLeads = await prisma.user.findMany({
      where: {
        role: 'TEAM_LEAD',
        companyId: companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    res.status(200).json({ teamLeads });
  } catch (error) {
    console.error('Error fetching team leads:', error);
    res.status(500).json({ message: 'Failed to fetch team leads' });
  }
};

export{
    getAllUsersInCompany,
    getTeamLeads,
}