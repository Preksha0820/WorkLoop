import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import apiService from "../../api/apiService";

export default function TeamLeadQuickStats() {
  const [employeeData, setEmployeeData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [reportStatusData, setReportStatusData] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [loading, setLoading] = useState(true);

  const COLORS = {
    completed: "#10b981",
    pending: "#f59e0b",
    notSubmitted: "#ef4444",
    submitted: "#6366f1", // Purple-like tone matching your screenshot
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [employeesRes, tasksRes, reportsRes] = await Promise.all([
          apiService.get("/teamlead/employees"),
          apiService.get("/teamlead/assigned-tasks"),
          apiService.get("/teamlead/team-reports"),
        ]);

        const employees = employeesRes.data?.employees || [];
        setEmployeeCount(employees.length);

        const reports = reportsRes.data?.reports || [];
        setTotalReports(reports.length);

        const tasks = tasksRes.data?.tasks || [];
        setTotalTasks(tasks.length);

        const today = dayjs().format("YYYY-MM-DD");
        const submittedTodayIds = new Set(
          reports
            .filter((r) => dayjs(r.createdAt).format("YYYY-MM-DD") === today)
            .map((r) => r.userId)
        );

        const submittedCount = submittedTodayIds.size;
        const notSubmittedCount = employees.length - submittedCount;

        setEmployeeData([
          { name: "Submitted", value: submittedCount },
          { name: "Not Submitted", value: notSubmittedCount },
        ]);

        const completedReports = reports.filter(
          (r) => r.status === "COMPLETED"
        ).length;
        const pendingReports = reports.filter(
          (r) => r.status !== "COMPLETED"
        ).length;

        setReportStatusData([
          { name: "Completed", value: completedReports },
          { name: "Pending", value: pendingReports },
        ]);

        const completedTasks = tasks.filter(
          (t) => t.status === "COMPLETED"
        ).length;
        setTaskData({
          total: tasks.length,
          completed: completedTasks,
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  const completionPercent =
    taskData.total === 0
      ? 0
      : Math.round((taskData.completed / taskData.total) * 100);

  return (
    <div className="p-6 bg-blue-50 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-purple-600 mb-2">
        Dashboard Overview
      </h1>
      <p className="text-gray-600 mb-6">
        Track your team's productivity and progress
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Employees
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {employeeCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tasks Given</p>
              <p className="text-2xl font-bold text-blue-600">{totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reports Submitted</p>
              <p className="text-2xl font-bold text-purple-600">
                {totalReports}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📄</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Tasks Completed
              </p>
              <p className="text-2xl font-bold text-green-600">
                {taskData.completed}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-11">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Today's Report Submission
          </h2>
          <div className="w-full flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={employeeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  dataKey="value"
                >
                  {employeeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "Submitted"
                          ? COLORS.submitted
                          : COLORS.notSubmitted
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Report Status
          </h2>
          <div className="w-full flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={reportStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  dataKey="value"
                >
                  {reportStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "Completed"
                          ? COLORS.completed
                          : COLORS.pending
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mt-11">
        <p className="text-sm text-gray-500 mb-2">Task Completion</p>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-1">
          <div
            className="bg-purple-500 h-4 rounded-full"
            style={{ width: `${completionPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600">{completionPercent}% completed</p>
        <p className="text-xs text-gray-500">
          Total Employees: {employeeCount}
        </p>
      </div>
    </div>
  );
}
