import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import { toast } from "react-toastify";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);

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

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-600 mb-2">Manage Employees</h2>
        <p className="text-gray-600 mb-6">View and manage your team members</p>

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
    </div>
  );
}
