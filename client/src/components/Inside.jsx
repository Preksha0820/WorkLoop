// src/components/BlogSection.jsx

export default function Inside() {
  return (
    <section className="py-9 px-6 md:px-20 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Blog Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/logos/blog.png" // <-- change this to your image path
            alt="Blog Highlight"
            className="rounded-2xl shadow-lg w-full"
          />
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Discover How TaskTracker Improves Productivity
          </h2>
          <p className="text-gray-600 mb-6">
            Stay updated with the latest trends in task management, employee reporting, and workflow automation. Read our blog to learn best practices.
          </p>
          <button className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition">
            Read More
          </button>
        </div>
      </div>
    </section>
  );
}
