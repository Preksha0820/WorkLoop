// src/components/Features.jsx
const features = [
  { icon: "/icons/task.png", title: "Task Management" },
  { icon: "/icons/a1.png", title: "Attendance with Leave Management" },
  { icon: "/icons/a2.png", title: "Dashboard" },
  { icon: "/icons/a3.png", title: "Notification" },
  { icon: "/icons/a4.png", title: "Ease of integration" },
  { icon: "/icons/alarm.png", title: "Time Sheets" },
  { icon: "/icons/calendar.png", title: "Calendar" },
  { icon: "/icons/chat.png", title: "Instant Message" },
  { icon: "/icons/a5.png", title: "Recurring Tasks" },
];

export default function Features() {
  return (
    <section className="bg-blue-50 py-10 px-4 md:px-20">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-10">
        Features that bring in Productivity Enhancement
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-[#76abdf] rounded-xl shadow hover:scale-[1.02] transition"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r from-pink-200 to-blue-100 flex items-center justify-center">
              <img src={feature.icon} alt="icon" className="w-10 h-10" />
            </div>
            <p className="text-blue-900 font-medium">{feature.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
