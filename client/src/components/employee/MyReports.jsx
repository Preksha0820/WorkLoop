import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import { format } from "date-fns";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await apiService.get("/reports");
        setReports(response.data.reports || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };

    fetchReports();
  }, []);

  const getStatusBadge = (status) => {
    const baseClass = "px-2 py-1 rounded text-xs font-semibold";
    switch (status) {
      case "APPROVED":
        return <span className={`${baseClass} bg-green-100 text-green-700`}>Approved</span>;
      case "REJECTED":
        return <span className={`${baseClass} bg-red-100 text-red-700`}>Rejected</span>;
      case "PENDING":
      default:
        return <span className={`${baseClass} bg-yellow-100 text-yellow-700`}>Pending</span>;
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">My Reports</h2>

      {reports.length === 0 ? (
        <p className="text-gray-500">No reports submitted yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Date</th>
                <th className="p-2">Task</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b">
                  <td className="p-2">{format(new Date(report.createdAt), "dd MMM yyyy")}</td>
                  <td className="p-2">{report.task?.title || "N/A"}</td>
                  <td className="p-2">{getStatusBadge(report.status)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-purple-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 max-w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedReport(null)}
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-2">Report Details</h3>
            <p className="mb-2 text-sm text-gray-700">
              <strong>Date:</strong> {format(new Date(selectedReport.createdAt), "dd MMM yyyy")}
            </p>
            <p className="mb-2 text-sm text-gray-700">
              <strong>Task:</strong> {selectedReport.task?.title || "N/A"}
            </p>
            <p className="mb-2 text-sm text-gray-700">
              <strong>Description:</strong> {selectedReport.description}
            </p>
            {selectedReport.file && (
              <a
                href={`http://localhost:0804/${selectedReport.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                📄 View Attachment
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
