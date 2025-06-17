import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import AssignTaskModal from "./AssignTaskModal";

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch tasks from API
  const fetchTasks = () => {
    apiService.get("/team-lead/assigned-tasks")
      .then(res => {
        // Adjust if your API returns tasks directly or inside a field
        setTasks(res.data.tasks || res.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg">Manage Tasks</h2>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Assign New Task
        </button>
      </div>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Assigned To</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Deadline</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-2">No tasks assigned</td>
            </tr>
          ) : (
            tasks.map(task => (
              <tr key={task.id}>
                <td className="border px-2 py-1">{task.title}</td>
                <td className="border px-2 py-1">{task.assignedTo?.name || "N/A"}</td>
                <td className="border px-2 py-1">{task.status}</td>
                <td className="border px-2 py-1">{new Date(task.deadline).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <AssignTaskModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        onTaskAssigned={fetchTasks} 
      />
    </div>
  );
}
