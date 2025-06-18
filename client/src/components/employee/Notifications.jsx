import { useEffect, useState } from "react";
import { format } from "date-fns";
import apiService from "../../api/apiService";
import socket from "../../socket";

export default function Notifications({ user }) {
  const [liveAssignedTasks, setLiveAssignedTasks] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "EMPLOYEE") return;

    socket.emit("join", `employee_${user.id}`);

    socket.on("taskAssigned", (data) => {
      setLiveAssignedTasks((prev) => [data.task, ...prev]); // Only real-time tasks
    });

    return () => {
      socket.off("taskAssigned");
    };
  }, [user]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Notifications</h2>

      {liveAssignedTasks.length === 0 ? (
        <p className="text-gray-500">No new task notifications yet.</p>
      ) : (
        <ul className="space-y-2">
          {liveAssignedTasks.map((task) => (
            <li
              key={task.id}
              className="p-3 bg-purple-50 border border-purple-200 rounded"
            >
              <div className="font-semibold text-purple-700">
                📌 New Task: {task.title}
              </div>
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
