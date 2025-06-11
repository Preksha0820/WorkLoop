const features = [
  { icon: "/icons/task.png", title: "Task Management" },
  { icon: "/icons/a1.png", title: "Attendance with Leave Management" },
  { icon: "/icons/a2.png", title: "Dashboard" },
  { icon: "/icons/a3.png", title: "WhatsApp Notification" },
  { icon: "/icons/a4.png", title: "Ease of Integration" },
  { icon: "/icons/alarm.png", title: "Time Sheets" },
  { icon: "/icons/calendar.png", title: "Calendar" },
  { icon: "/icons/chat.png", title: "Instant Message" },
  { icon: "/icons/location.png", title: "Geolocation" },
  { icon: "/icons/a6.png", title: "Voice Message" },
  { icon: "/icons/a7.png", title: "Vernacular Languages" },
  { icon: "/icons/a5.png", title: "Recurring Tasks" },
];

export default function Features() {
  return (
    <section className="bg-[#eaf6fd] py-12 px-4 md:px-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-12">
        Features that bring in Productivity Enhancement
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center p-0 rounded-full overflow-hidden shadow-md bg-[#bba2fa] w-full max-w-md"
          >
            {/* Left Circular Icon */}
            <div className="w-20 h-20 bg-[#d5c4f2] flex items-center justify-center rounded-full flex-shrink-0">
              <img src={feature.icon} alt="icon" className="w-12 h-12" />
            </div>

            {/* Right Rectangular Text */}
            <div className="pl-4 pr-6 py-4">
              <p className="text-blue-900 font-semibold">{feature.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
