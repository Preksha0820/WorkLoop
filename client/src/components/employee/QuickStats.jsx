import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import axios from 'axios';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import apiService from '../../api/apiService';

export default function QuickStats() {
  const [taskData, setTaskData] = useState([
    { name: 'Completed', value: 0 },
    { name: 'Pending', value: 0 },
  ]);
  const [reportData, setReportData] = useState([
    { name: 'Today', reports: 0 },
    { name: 'This Week', reports: 0 },
  ]);

  const COLORS = ['#16a34a', '#facc15'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch tasks
        const taskRes = await axios.get('/api/employee/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const tasks = taskRes.data.tasks || [];
        const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
        const pendingCount = tasks.filter(t => t.status === 'PENDING').length;

        setTaskData([
          { name: 'Completed', value: completedCount },
          { name: 'Pending', value: pendingCount },
        ]);

        // Fetch reports
        const reportRes = await apiService.get('/employee/reports');

        const reports = reportRes.data.reports || [];
        const today = dayjs();
        const startOfWeek = today.startOf('week');

        const todayCount = reports.filter(r => dayjs(r.createdAt).isSame(today, 'day')).length;
        const thisWeekCount = reports.filter(r => dayjs(r.createdAt).isAfter(startOfWeek)).length;

        setReportData([
          { name: 'Today', reports: todayCount },
          { name: 'This Week', reports: thisWeekCount },
        ]);

      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Quick Stats</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks Pie Chart */}
        <div className="flex flex-col items-center">
          <PieChart width={250} height={250}>
            <Pie
              data={taskData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
              dataKey="value"
            >
              {taskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
          <div className="text-sm text-gray-600">
            <p>✅ Completed: <span className="font-semibold">{taskData[0].value}</span></p>
            <p>🔔 Pending: <span className="font-semibold">{taskData[1].value}</span></p>
          </div>
        </div>

        {/* Reports Bar Chart */}
        <div>
          <BarChart width={300} height={250} data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="reports" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
          <div className="mt-2 text-sm text-gray-600">
            <p>📝 Today: <span className="font-semibold">{reportData[0].reports}</span></p>
            <p>📝 This Week: <span className="font-semibold">{reportData[1].reports}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
