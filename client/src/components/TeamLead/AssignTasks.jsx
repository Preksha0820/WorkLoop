import { useState, useEffect } from "react";
import apiService from "../../api/apiService";
import { toast } from "react-toastify";

export default function AssignTaskPage() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    assignedToId: "",
    title: "",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    apiService.get("/teamlead/employees")
      .then(res => setEmployees(res.data.employees))
      .catch(() => toast.error("Failed to load employees"));
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assignedToId || !formData.title || !formData.description || !formData.deadline) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await apiService.post(`/teamlead/task-assign/${formData.assignedToId}`, {
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
      });
      toast.success("Task assigned successfully");
      setFormData({ assignedToId: "", title: "", description: "", deadline: "" });
    } catch (err) {
      toast.error("Failed to assign task");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen flex items-center justify-center">
      <div className="max-w-[700px] w-full bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">Assign New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Employee</label>
            <select
              name="assignedToId"
              value={formData.assignedToId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Describe the task"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg shadow-md transition transform hover:scale-105"
          >
            Assign Task
          </button>

        </form>
      </div>
    </div>
  );
}
