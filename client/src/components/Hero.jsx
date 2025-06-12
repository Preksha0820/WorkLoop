// src/components/Hero.jsx
export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-16 mt-20 mb-10 gap-20 bg-slate-50 " >
      <div className="md:w-1/2 space-y-4">
        <h1 className="text-4xl font-bold">
          <span className="text-pink-500">Simplify.</span>{" "}
          <span className="text-blue-900">Organize.</span>{" "}
          <span className="text-sky-400">Automate.</span>
        </h1>
        <p className="text-xl font-semibold text-blue-900">
          Track Tasks, Coordinate Teams, Monitor Performance and Report Back - All in One Place!
        </p>
        <p className="text-gray-600 text-md">
          Experience the future of business automation with Task Tracker! A mobile-first solution powered by AI that digitizes and automates every business department, making team collaboration effortless and organized. With the support of 7 Indian languages, collaborate with teams seamlessly, no matter where they are. Task Tracker's user-friendly interface ensures that you can say goodbye to complexity and hello to a simpler, more efficient way of working together for business growth.
        </p>
      </div>
      <div className="md:w-1/2 mt-8 md:mt-0">
        <iframe
          className="w-full h-64 md:h-80 rounded-lg shadow-lg"
          src="https://www.youtube.com/embed/KVZ-P-ZI6W4"
          title="Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}
