import { useEffect, useState } from "react";
import apiService from "../../api/apiService"; 
import { format } from "date-fns";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [workSummary, setWorkSummary] = useState("");
  const [file, setFile] = useState(null);

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

  const openModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("summary", workSummary);
      formData.append("taskId", selectedTask.id);
      if (file) formData.append("file", file);

      await apiService.post("/employee/report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Report submitted successfully");
      setShowModal(false);
      setWorkSummary("");
      setFile(null);
      fetchTasks();
    } catch (err) {
      console.error("Error submitting report", err);
      alert("Failed to submit report");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-gray-700 mb-5">My Tasks</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by task name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="">Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="IN_PROGRESS">In Progress</option>
        </select>
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Task Name</th>
              <th className="p-2">Description</th>
              <th className="p-2">Status</th>
              <th className="p-2">Deadline</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="p-2">{task.title}</td>
                <td className="p-2">
                  {task.description.length > 50
                    ? task.description.slice(0, 50) + "..."
                    : task.description}
                </td>
                <td className="p-2">{task.status}</td>
                <td className="p-2">
                  {format(new Date(task.deadline), "yyyy-MM-dd")}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => openModal(task)}
                    className="bg-purple-600 text-white px-2 py-1 rounded"
                  >
                    {task.status === "COMPLETED" ? "Update" : "Submit"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              Submit Work for: {selectedTask.title}
            </h3>
            <textarea
              className="w-full border rounded mb-2 p-2"
              placeholder="Work summary"
              value={workSummary}
              onChange={(e) => setWorkSummary(e.target.value)}
            ></textarea>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-purple-600 text-white px-3 py-1 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
