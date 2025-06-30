import prisma from '../prisma.js';

const getAllEmployeesInCompany = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

  try {
    const skip = (page - 1) * limit; // Calculate the number of records to skip
    const take = parseInt(limit, 10); // Number of records to fetch

    const users = await prisma.user.findMany({
      where: {
        companyId: req.user.companyId,
        role: 'EMPLOYEE'
      },
      select: { id: true, name: true, email: true, role: true },
      skip,
      take,
    });

    const totalUsers = await prisma.user.count({
      where: {
        companyId: req.user.companyId,
        role: { not: 'ADMIN' },
      },
    });

    res.json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page, 10),
    });
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

const getEachEmployeeByTeam = async (req, res) => {
  try {
    const { companyId } = req.user;

    // Fetch all team leads in the company
    const teamLeads = await prisma.user.findMany({
      where: {
        role: 'TEAM_LEAD',
        companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // For each team lead, get their employees
    const result = await Promise.all(
      teamLeads.map(async (lead) => {
        const employees = await prisma.user.findMany({
          where: {
            companyId,
            teamLeadId: lead.id,
            role: 'EMPLOYEE',
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        return {
          teamLead: lead,
          employees,
        };
      })
    );

    res.status(200).json({ data: result });
  } catch (err) {
    console.error('Error fetching employees by team:', err);
    res.status(500).json({ message: 'Failed to fetch employees by team' });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const { id, companyId } = req.user;

    // Fetch basic admin info with company
    const admin = await prisma.user.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Accurate team lead count (reuses same logic as getTeamLeads)
    const totalTeamLeads = await prisma.user.count({
      where: {
        companyId,
        role: 'TEAM_LEAD',
      },
    });

    // Accurate employee count (same logic as getAllEmployeesInCompany)
    const totalEmployees = await prisma.user.count({
      where: {
        companyId,
        role: 'EMPLOYEE',
      },
    });

    res.json({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      createdAt: admin.createdAt,
      companyName: admin.company?.name || "",
      companyDomain: admin.company?.domain || "",
      totalTeamLeads,
      totalEmployees,
    });

  } catch (error) {
    console.error("Admin profile error:", error);
    res.status(500).json({ message: "Failed to load profile", error: error.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const updatedAdmin = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        email,
        phone,
      },
    });

    res.json({ message: "Profile updated successfully", updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};


export{
    getAllEmployeesInCompany,
    getTeamLeads,
    deleteTeamLeadsById,
    switchEmployeeTeam,
    changeEmployeeRole,
    getEachEmployeeByTeam
}