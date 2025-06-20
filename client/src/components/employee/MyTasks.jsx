import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import { toast } from "react-toastify";
// Using native date formatting instead of date-fns

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingTasks, setUpdatingTasks] = useState(new Set());

  const fetchTasks = async () => {
    try {
      const res = await apiService.get("/employee/tasks");
      setTasks(res.data.tasks);
      setFilteredTasks(res.data.tasks);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Apply filter and search
  useEffect(() => {
    let filtered = [...tasks];
    if (statusFilter) {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }
    if (search) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredTasks(filtered);
  }, [tasks, search, statusFilter]);

  const updateTaskStatus = async (taskId, newStatus) => {
    setUpdatingTasks(prev => new Set([...prev, taskId]));
    
    try {
      await apiService.put(`/employee/task-status/${taskId}`, {
        status: newStatus
      });
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      
      // Show success message
      toast.success(`Task status updated to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
    
      toast.error("Failed to update task status. Please try again.");
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "PENDING":
        return "IN_PROGRESS";
      case "IN_PROGRESS":
        return "COMPLETED";
      case "COMPLETED":
        return "PENDING";
      default:
        return "PENDING";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "IN_PROGRESS":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "COMPLETED":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusButtonColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "IN_PROGRESS":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "COMPLETED":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      default:
        return "bg-gray-600 hover:bg-gray-700 text-white";
    }
  };

  const getStatusButtonText = (status) => {
    switch (status) {
      case "PENDING":
        return "Start Task";
      case "IN_PROGRESS":
        return "Mark Complete";
      case "COMPLETED":
        return "Reset to Pending";
      default:
        return "Update Status";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h2>
          <p className="text-gray-600">Manage and update status of your assigned tasks</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search by task name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="min-w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Task Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Task Details</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Deadline</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {task.description.length > 80
                            ? task.description.slice(0, 80) + "..."
                            : task.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${isOverdue(task.deadline) && task.status !== "COMPLETED" ? 'text-red-600' : 'text-gray-900'}`}>
                          {new Date(task.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                        </span>
                        {isOverdue(task.deadline) && task.status !== "COMPLETED" && (
                          <span className="text-xs text-red-500 font-medium">Overdue</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => updateTaskStatus(task.id, getNextStatus(task.status))}
                        disabled={updatingTasks.has(task.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${getStatusButtonColor(task.status)}`}
                      >
                        {updatingTasks.has(task.id) ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </>
                        ) : (
                          <>
                            {getStatusIcon(getNextStatus(task.status))}
                            {getStatusButtonText(task.status)}
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No tasks found</div>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}