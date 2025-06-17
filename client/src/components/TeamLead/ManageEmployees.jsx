
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/api/teamlead/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      alert("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`/api/teamlead/delete-employee/${id}`);
      alert("Employee deleted");
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Failed to delete employee");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="p-4">Loading employees...</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
        <Sidebar/>
      <h2 className="text-xl font-bold mb-4">Manage Employees</h2>
      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Created At</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2">{emp.email}</td>
                <td className="border p-2">{new Date(emp.createdAt).toLocaleDateString()}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
