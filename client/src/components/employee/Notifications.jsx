import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import { format } from "date-fns";

export default function Notifications() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await apiService.get("/tasks");
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error("Error fetching tasks for notifications", err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Notifications</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No new task assignments.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="p-3 bg-gray-100 rounded">
              <div className="font-semibold text-purple-700">{task.title}</div>
              <div className="text-sm text-gray-600">
                Assigned on: {format(new Date(task.createdAt), "dd MMM yyyy")}
              </div>
              <div className="text-sm text-gray-600">
                Deadline: {format(new Date(task.deadline), "dd MMM yyyy")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
