import { useEffect, useState } from "react";
import apiService from "../../api/apiService";
import { Bell } from "lucide-react";

export default function Notifications() {
  const [pendingReports, setPendingReports] = useState(0);

  useEffect(() => {
    apiService.get("/team-lead/team-reports")
      .then(res => {
        const count = res.data.reports.filter(r => r.status === "PENDING").length;
        setPendingReports(count);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-purple-600" />
      {pendingReports > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
          {pendingReports}
        </span>
      )}
    </div>
  );
}
