import { useEffect, useState } from "react";
import apiService from "../../api/apiService";

export default function TeamReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    apiService.get("/team-lead/team-reports")
      .then(res => setReports(res.data.reports))
      .catch(console.error);
  }, []);

  const updateStatus = async (id, status) => {
    await apiService.put(`/team-lead/report-status/${id}`, { status });
    setReports(reports.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold text-lg mb-2">Team Reports</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Date</th><th>Employee</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.id}>
              <td>{new Date(r.reportDate).toLocaleDateString()}</td>
              <td>{r.user?.name}</td>
              <td>{r.status}</td>
              <td>
                {r.status === "PENDING" && (
                  <>
                    <button onClick={() => updateStatus(r.id, "APPROVED")} className="text-green-500">Approve</button>
                    <button onClick={() => updateStatus(r.id, "REJECTED")} className="text-red-500">Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
