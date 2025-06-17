import { useEffect, useState } from "react";
import apiService from "../../api/apiService";

export default function QuickStats() {
  const [stats, setStats] = useState({
    employees: 0,
    tasks: 0,
    pendingReports: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const empRes = await apiService.get("/team-lead/employees");
      const taskRes = await apiService.get("/team-lead/assigned-tasks");
      const reportRes = await apiService.get("/team-lead/team-reports");

      setStats({
        employees: empRes.data.employees.length,
        tasks: taskRes.data.tasks.length,
        pendingReports: reportRes.data.reports.filter(r => r.status === "PENDING").length
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold text-lg mb-2">Quick Stats</h2>
      <ul className="space-y-2">
        <li>👥 Employees: {stats.employees}</li>
        <li>✅ Tasks Assigned: {stats.tasks}</li>
        <li>📝 Pending Reports: {stats.pendingReports}</li>
      </ul>
    </div>
  );
}
