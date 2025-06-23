import { useEffect, useState } from "react";
import apiService from "../../api/apiService";

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await apiService.get("/teamlead/assigned-tasks");
      setTasks(res.data.tasks);
      setFilteredTasks(res.data.tasks);
    } catch (err) {
      console.error("Failed to fetch assigned tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let result = tasks;

    if (searchTerm) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((task) => task.status === statusFilter.toUpperCase().replace(" ", "_"));
    }

    setFilteredTasks(result);
  }, [searchTerm, statusFilter, tasks]);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-700 mb-2">Manage Tasks</h2>
        <p className="text-gray-600 mb-6">View and manage all tasks you’ve assigned</p>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by task title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 border border-purple-700 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-purple-900"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-1/4 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-purple-300"
          >
            <option value="">Filter by status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-purple-200">
                <tr>
                  <th className="py-4 px-6 font-semibold text-gray-800">Task Title</th>
                  <th className="py-4 px-6 font-semibold text-gray-800">Assigned To</th>
                  <th className="py-4 px-6 font-semibold text-gray-800">Status</th>
                  <th className="py-4 px-6 font-semibold text-gray-800">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-purple-100 transition">
                      <td className="py-4 px-6 font-medium text-gray-700">{task.title}</td>
                      <td className="py-4 px-6 text-gray-600">{task.assignedTo?.name || "N/A"}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            task.status === "COMPLETED"
                              ? "bg-green-200 text-green-800"
                              : task.status === "PENDING"
                              ? "bg-yellow-200 text-yellow-800"
                              : task.status === "IN_PROGRESS"
                              ? "bg-blue-200 text-blue-800"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(task.deadline).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
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
