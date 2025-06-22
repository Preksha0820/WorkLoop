import { useEffect, useState } from "react";
import apiService from "../../api/apiService";

export default function TeamReports() {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await apiService.get("/teamlead/team-reports");
      setReports(res.data.reports);
    } catch (err) {
      console.error("Failed to fetch team reports", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-600 mb-2">Team Reports</h2>
        <p className="text-gray-600 mb-6">View reports submitted by your team members</p>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-purple-200">
                <tr>
                  <th className="py-4 px-6 font-semibold text-gray-800">Report Content</th>
                  <th className="py-4 px-6 font-semibold text-gray-800">Submitted By</th>
                  <th className="py-4 px-6 font-semibold text-gray-800">Date Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500 italic">
                      No reports submitted yet
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-indigo-100 transition"
                    >
                      <td className="py-4 px-6 text-gray-700">
                        {report.content.length > 100
                          ? `${report.content.slice(0, 100)}...`
                          : report.content}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {report.user?.name || (
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(report.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
