import { getIO } from "./index.js";

export const notifyTeamLeadOnReportSubmission = (teamLeadId, report) => {
  const io = getIO();

  // Emit event to the team lead room or socket
  io.to(`teamLead_${teamLeadId}`).emit("reportSubmitted", {
    message: "New report submitted",
    report,
  });
};

export const notifyEmployeeOnReportReview = (employeeId, report) => {
  const io = getIO();

  io.to(`employee_${employeeId}`).emit("reportReviewed", {
    message: `Your report has been ${report.status}`,
    report,
  });
};

export const notifyEmployeeOnTaskAssignment = (employeeId, task) => {
  const io = getIO();

  io.to(`employee_${employeeId}`).emit("taskAssigned", {
    message: "New task assigned",
    task,
  });
};
