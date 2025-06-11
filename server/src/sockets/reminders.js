import cron from "node-cron";
import prisma from "../prisma.js";
import { getIO } from "./index.js";

export const startReminderJobs = () => {
  const io = getIO();

  // Every day at 9 AM send reminders
  cron.schedule("0 9 * * *", async () => {
    console.log("Running reminder job");

    // Fetch employees with pending tasks
    const pendingTasks = await prisma.task.findMany({
      where: { status: "PENDING" },
      include: { assignedTo: true },
    });

    // Notify employees about pending tasks
    pendingTasks.forEach((task) => {
      io.to(`employee_${task.assignedToId}`).emit("pendingTasksReminder", {
        message: `You have pending task: ${task.title}`,
        task,
      });
    });

    // Fetch employees who missed submitting daily report today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employees = await prisma.user.findMany({ where: { role: "EMPLOYEE" } });

    for (const emp of employees) {
      const reportToday = await prisma.report.findFirst({
        where: {
          userId: emp.id,
          createdAt: {
            gte: today,
          },
        },
      });

      if (!reportToday) {
        io.to(`employee_${emp.id}`).emit("missedReportReminder", {
          message: "You missed submitting your daily report today!",
        });
      }
    }
  });
};
