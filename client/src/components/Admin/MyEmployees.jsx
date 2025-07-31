import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  Trash2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCog,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import apiService from "../../api/apiService";

const EmployeeManagementDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [teamLeads, setTeamLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newTeamLeadId, setNewTeamLeadId] = useState("");
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeamLead, setSelectedTeamLead] = useState(null);

  // Fetch employees
  const fetchEmployees = async (page = 1) => {
    setLoading(true);
    try {
      const response = await apiService.get(
        `/admin/employees?page=${page}&limit=${limit}`
      );
      setEmployees(response.data.users || []);
      setTotalUsers(response.data.totalUsers || 0);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (error) {
      toast.error("Failed to fetch employees");
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch team leads
  const fetchTeamLeads = async () => {
    setLoading(true);
    try {
      const response = await apiService.get("/admin/team-leads");
      setTeamLeads(response.data.teamLeads || []);
    } catch (error) {
      toast.error("Failed to fetch team leads");
      console.error("Error fetching team leads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (activeTab === "employees") {
      fetchEmployees(currentPage);
    } else {
      fetchTeamLeads();
    }
  }, [activeTab, currentPage]);

  // Handle delete team lead
  const handleDeleteTeamLead = async () => {
    if (!selectedTeamLead) return;

    setLoading(true);
    try {
      await apiService.delete(`/admin/team-lead/${selectedTeamLead.id}`);
      setTeamLeads(teamLeads.filter((lead) => lead.id !== selectedTeamLead.id));
      toast.success("Team lead deleted successfully!");
      setShowDeleteModal(false);
      setSelectedTeamLead(null);
    } catch (error) {
      toast.error("Failed to delete team lead");
      console.error("Error deleting team lead:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle switch team
  const handleSwitchTeam = async () => {
    if (!newTeamLeadId) {
      toast.error("Please select a team lead");
      return;
    }

    setLoading(true);
    try {
      await apiService.put(`/admin/switch-team/${selectedEmployee.id}`, {
        newTeamLeadId: newTeamLeadId,
      });
      const teamLead = teamLeads.find(
        (lead) => lead.id === parseInt(newTeamLeadId)
      );
      toast.success(
        `${selectedEmployee.name} switched to ${teamLead.name}'s team!`
      );
      setShowSwitchModal(false);
      setNewTeamLeadId("");
      setSelectedEmployee(null);
      fetchEmployees(currentPage); // Refresh employees list
    } catch (error) {
      toast.error("Failed to switch employee team");
      console.error("Error switching team:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle change role to TEAM_LEAD
  const handlePromoteToTeamLead = async () => {
    setLoading(true);
    try {
      await apiService.patch(`/admin/change-role/${selectedEmployee.id}`, {
        newRole: "TEAM_LEAD",
      });
      toast.success(`${selectedEmployee.name} promoted to Team Lead!`);
      setShowRoleModal(false);
      setSelectedEmployee(null);
      fetchEmployees(currentPage); // Refresh employees list
      fetchTeamLeads(); // Refresh team leads list
    } catch (error) {
      toast.error("Failed to promote employee");
      console.error("Error promoting employee:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchEmployees(newPage);
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter team leads based on search
  const filteredTeamLeads = teamLeads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Employee Management
              </h1>
              <p className="text-gray-600">
                Manage your team members and organizational structure
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("employees")}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                activeTab === "employees"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Employees</span>
            </button>
            <button
              onClick={() => setActiveTab("teamleads")}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                activeTab === "teamleads"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span>Team Leads</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            )}

            {!loading && activeTab === "employees" && (
              <div>
                <div className="grid gap-4">
                  {filteredEmployees.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        No employees found
                      </p>
                    </div>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {employee.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {employee.name}
                              </h3>
                              <p className="text-gray-600">{employee.email}</p>
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                                {employee.role}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setShowSwitchModal(true);
                              }}
                              className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                              <ArrowRight className="w-4 h-4" />
                              <span>Switch Team</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setShowRoleModal(true);
                              }}
                              className="bg-purple-200 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                              <UserCog className="w-4 h-4" />
                              <span>Promote</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8">
                    <div className="text-sm text-gray-600">
                      Showing {filteredEmployees.length} of {totalUsers}{" "}
                      employees
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                        {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === "teamleads" && (
              <div className="grid gap-4">
                {filteredTeamLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No team leads found</p>
                  </div>
                ) : (
                  filteredTeamLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {lead.name}
                            </h3>
                            <p className="text-gray-600">{lead.email}</p>
                            {lead.phone && (
                              <p className="text-gray-500 text-sm">
                                {lead.phone}
                              </p>
                            )}
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                              Team Lead
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {lead.createdAt && (
                            <p className="text-sm text-gray-500 mb-2">
                              Joined:{" "}
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </p>
                          )}
                          <button
                            onClick={() => {
                              setSelectedTeamLead(lead);
                              setShowDeleteModal(true);
                            }}
                            disabled={loading}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
                          >
                            {loading ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Switch Team Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Switch Employee Team
            </h2>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Switch <strong>{selectedEmployee?.name}</strong> to a new team
                lead:
              </p>
              <select
                value={newTeamLeadId}
                onChange={(e) => setNewTeamLeadId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Team Lead</option>
                {teamLeads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowSwitchModal(false);
                  setNewTeamLeadId("");
                  setSelectedEmployee(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSwitchTeam}
                disabled={loading || !newTeamLeadId}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span>Switch Team</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Team Lead Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Delete Team Lead
            </h2>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete{" "}
                <strong>{selectedTeamLead?.name}</strong>?
              </p>
              <div className="bg-red-50 p-4 rounded-xl">
                <p className="text-red-700 text-sm">
                  This action cannot be undone. All employees under this team
                  lead will need to be reassigned.
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedTeamLead(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTeamLead}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promote to Team Lead Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Promote to Team Lead
            </h2>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to promote{" "}
                <strong>{selectedEmployee?.name}</strong> to Team Lead?
              </p>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-blue-700 text-sm">
                  This will change their role from Employee to Team Lead and
                  they will gain additional permissions.
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedEmployee(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePromoteToTeamLead}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <UserCog className="w-4 h-4" />
                )}
                <span>Promote</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagementDashboard;
