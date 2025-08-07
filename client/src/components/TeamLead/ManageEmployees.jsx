import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import { toast } from "react-toastify";
import { UserPlus, X } from "lucide-react";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await apiService.get("/teamlead/employees");
      setEmployees(res.data.employees);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee? This will remove their tasks and reports too.")) {
      return;
    }

    try {
      await apiService.delete(`/teamlead/delete-employee/${id}`);
      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee", err);
      toast.error("Failed to delete employee");
    }
  };

  const inviteEmployee = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsInviting(true);
    try {
      await apiService.post("/teamlead/invite-employee", { email: inviteEmail });
      toast.success("Invitation sent successfully!");
      setInviteEmail("");
      setShowInviteModal(false);
    } catch (err) {
      console.error("Error inviting employee", err);
      toast.error(err.response?.data?.message || "Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-purple-600 mb-2">Manage Employees</h2>
            <p className="text-gray-600">View and manage your team members</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            Invite Employee
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-purple-200">
                <tr>
                  <th className="py-4 px-6 font-semibold text-gray-800">Name</th>
                  <th className="py-4 px-6 font-semibold text-gray-800">Email</th>
                  <th className="py-4 px-6 font-semibold text-gray-800">Created At</th>
                  <th className="py-4 px-6 font-semibold text-center text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-indigo-50 transition">
                      <td className="py-4 px-6 text-gray-700">{emp.name}</td>
                      <td className="py-4 px-6 text-gray-600">{emp.email}</td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(emp.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="py-4 px-6 text-center space-x-2">
                        <button
                          onClick={() => deleteEmployee(emp.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full shadow-sm transition"
                        >
                          Delete
                        </button>
                        {/* Future: Add View / Edit buttons here */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invite Employee Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Invite Employee</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={inviteEmployee}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter employee's email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isInviting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
