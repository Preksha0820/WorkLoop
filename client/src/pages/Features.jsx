import React from "react";

const features = [
  {
    id: "task-tracking",
    title: "Smart Task Tracking",
    description:
      "Assign, prioritize, and track tasks effortlessly. View progress, deadlines, and updates in one place, ensuring clarity across the team.",
    image: "/features/task-tracking.svg",
  },
  {
    id: "daily-reports",
    title: "Daily Work Reports",
    description:
      "Employees can submit daily reports with summaries, selected tasks, and file uploads. Helps team leads monitor work and approve with feedback.",
    image: "/features/daily-report.svg",
  },
  {
    id: "team-management",
    title: "Efficient Team Management",
    description:
      "Team Leads can easily manage their teams—assign tasks, review performance, and maintain a clear structure in real-time.",
    image: "/features/team-management.svg",
  },
  {
    id: "real-time-alerts",
    title: "Real-time Alerts & Notifications",
    description:
      "Get notified instantly when reports are submitted or reviewed. Reminders ensure no report or task is missed.",
    image: "/features/notifications.svg",
  },
  {
    id: "progress-tracking",
    title: "Insightful Progress Tracking",
    description:
      "Track employee productivity, completed tasks, and daily logs via dashboards and reports. Make decisions backed by real-time data.",
    image: "/features/analytics.svg",
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-12 px-4 md:px-16 bg-gray-50">
      <h2 className="text-4xl font-bold text-center mb-12 text-blue-900">
        Platform Features
      </h2>

      {features.map((feature, index) => (
        <div key={feature.id} id={feature.id} className={`flex flex-col md:flex-row items-center gap-8 mb-16 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
          <img
            src={feature.image}  alt={feature.title}  className="w-full md:w-1/2 rounded-xl shadow-md" />
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">
              {feature.title}
            </h3>
            <p className="text-gray-700 text-lg">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
