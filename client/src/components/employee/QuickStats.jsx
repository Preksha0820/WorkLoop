import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import apiService from '../../api/apiService';

export default function QuickStats() {
  const [taskData, setTaskData] = useState([
    { name: 'Completed', value: 0 },
    { name: 'Pending', value: 0 },
  ]);
  const [reportStats, setReportStats] = useState({
    todayCount: 0,
    weekCount: 0,
    todayReports: [],
    weekReports: []
  });
  const [loading, setLoading] = useState(true);

  const COLORS = {
    completed: '#10b981',
    pending: '#f59e0b',
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#06b6d4'
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Fetch tasks
        const taskRes = await apiService.get('/employee/tasks');
        const tasks = taskRes.data.tasks || [];

        const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
        const pendingCount = tasks.filter(t => t.status === 'PENDING').length;

        setTaskData([
          { name: 'Completed', value: completedCount },
          { name: 'Pending', value: pendingCount },
        ]);

        // Fetch report stats from your dedicated endpoint
        const reportRes = await apiService.get('/employee/report-stats');
        setReportStats(reportRes.data);

      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const reportData = [
    { name: 'Today', reports: reportStats.todayCount },
    { name: 'This Week', reports: reportStats.weekCount },
  ];

  // Create weekly trend data
  const weeklyTrendData = reportStats.weekReports.reduce((acc, report) => {
    const day = dayjs(report.reportDate).format('ddd');
    const existing = acc.find(item => item.day === day);
    if (existing) {
      existing.reports += 1;
    } else {
      acc.push({ day, reports: 1 });
    }
    return acc;
  }, []);

  const statusData = reportStats.weekReports.reduce((acc, report) => {
    const status = report.status;
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          <p className="text-indigo-600">
            {`${payload[0].dataKey}: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalTasks = taskData[0].value + taskData[1].value;
  const completionRate = totalTasks > 0 ? ((taskData[0].value / totalTasks) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1">Track your productivity and progress</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-lg font-semibold text-gray-700">{dayjs().format('MMM DD, YYYY')}</p>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
                <p className="text-2xl font-bold text-green-600">{taskData[0].value}</p>
                <p className="text-xs text-gray-400 mt-1">{completionRate}% completion rate</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
                <p className="text-2xl font-bold text-amber-600">{taskData[1].value}</p>
                <p className="text-xs text-gray-400 mt-1">Requires attention</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Reports</p>
                <p className="text-2xl font-bold text-indigo-600">{reportStats.todayCount}</p>
                <p className="text-xs text-gray-400 mt-1">Submitted today</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Weekly Reports</p>
                <p className="text-2xl font-bold text-purple-600">{reportStats.weekCount}</p>
                <p className="text-xs text-gray-400 mt-1">This week total</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              Task Distribution
            </h3>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={taskData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    dataKey="value"
                  >
                    <Cell fill={COLORS.completed} />
                    <Cell fill={COLORS.pending} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Completed ({taskData[0].value})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Pending ({taskData[1].value})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Report Submission
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="reports" 
                  fill={COLORS.secondary} 
                  radius={[6, 6, 0, 0]}
                  className="hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Reports Section */}
        {reportStats.todayReports.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <span className="mr-2">📋</span>
                Today's Reports ({reportStats.todayReports.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {reportStats.todayReports.slice(0, 3).map((report) => (
                <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">{report.content}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Task ID: {report.taskId} • {dayjs(report.reportDate).format('h:mm A')}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        report.status === 'PENDING' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {reportStats.todayReports.length > 3 && (
              <div className="px-6 py-3 bg-gray-50 text-center">
                <p className="text-sm text-gray-600">
                  And {reportStats.todayReports.length - 3} more reports...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Weekly Progress</h3>
            <span className="text-sm text-gray-500">{reportStats.weekCount} reports this week</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((reportStats.weekCount / 7) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Goal: 7 reports per week • Current: {reportStats.weekCount}/7
          </p>
        </div>
      </div>
    </div>
  );
}