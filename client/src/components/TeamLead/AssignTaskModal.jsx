import { useState, useEffect } from "react";
import apiService from "../../api/apiService";

export default function AssignTaskModal({ open, onClose, onTaskAssigned }) {
  const [employees, setEmployees] = useState([]);
  const [assignedToId, setAssignedToId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (open) {
      apiService.get("/team-lead/employees")
        .then(res => setEmployees(res.data))
        .catch(console.error);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assignedToId || !title || !description || !deadline) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await apiService.post(`/team-lead/task-assign/${assignedToId}`, {
        title, description, deadline
      });
      onTaskAssigned(); // Refresh task list
      onClose(); // Close modal
    } catch (err) {
      console.error("Error assigning task:", err);
      alert("Failed to assign task");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="font-bold mb-4 text-lg">Assign Task</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          
          <select 
            value={assignedToId} 
            onChange={(e) => setAssignedToId(e.target.value)} 
            className="border p-2 rounded"
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>

          <input 
            type="text" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="border p-2 rounded"
          />

          <textarea 
            placeholder="Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="border p-2 rounded"
          />

          <input 
            type="date" 
            value={deadline} 
            onChange={(e) => setDeadline(e.target.value)} 
            className="border p-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
