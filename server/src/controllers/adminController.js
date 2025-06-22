import prisma from '../prisma.js';

const getAllEmployeesInCompany = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        companyId: req.user.companyId,
        role: { not: 'ADMIN' }, 
      },
      select: { id: true, name: true, email: true, role: true },
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

const deleteTeamLeadsById= async(req, res) => { 
 
   const {id} = req.params;
  try {
    const deletedTeamLead = await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    return res.status(200).json({ message: 'Team lead deleted successfully', deletedTeamLead });     
  }
  catch (error) {  
    return res.status(500).json({ message: 'Failed to delete team lead', error: error.message }); 
  }
    
};


const switchEmployeeTeam = async (req, res) => {
  const { employeeId } = req.params;
  const { newTeamLeadId } = req.body;

  try {
    // Validate newTeamLeadId
    const parsedNewTeamLeadId = parseInt(newTeamLeadId, 10);
  
    if (!newTeamLeadId || isNaN(parsedNewTeamLeadId)) {
      return res.status(400).json({ message: 'Valid new team lead ID is required' });
    }

    // Find the employee to switch
    const employee = await prisma.user.findUnique({
      where: { id: parseInt(employeeId, 10) },
      select: { id: true, name: true, teamLeadId: true },
    });
   
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Ensure the new team lead exists
    const newTeamLead = await prisma.user.findUnique({
      where: { id: parsedNewTeamLeadId },
    });
    if (!newTeamLead) {
      return res.status(404).json({ message: 'New team lead not found' });
    }
  
    // Update the employee's team lead
    const updatedEmployee = await prisma.user.update({
      where: { id: parseInt(employeeId, 10) },
      data: { teamLeadId: parsedNewTeamLeadId },
    });

    res.status(200).json({ message: 'Employee switched to new team lead', updatedEmployee });
  } catch (error) {
    console.error('Error switching employee team:', error);
    res.status(500).json({ message: 'Failed to switch employee team', error: error.message });
  }
};

const changeEmployeeRole = async (req, res) => {
  
  const { employeeId } = req.params;
  const { newRole } = req.body;
  try {
    // Find the employee to change role
    const employee = await prisma.user.findUnique({
      where: { id: parseInt(employeeId) },
      select: { id: true, name: true, role: true }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update the employee's role
    const updatedEmployee = await prisma.user.update({
      where: { id: parseInt(employeeId) },
      data: { role: newRole }
    });

    res.status(200).json({ message: 'Employee role changed successfully', updatedEmployee });
  } catch (error) {
    console.error('Error changing employee role:', error);
    res.status(500).json({ message: 'Failed to change employee role', error: error.message });
  }
}


export{
    getAllEmployeesInCompany,
    getTeamLeads,
    deleteTeamLeadsById,
    switchEmployeeTeam,
    changeEmployeeRole,
}