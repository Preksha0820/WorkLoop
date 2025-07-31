import { useNavigate } from "react-router-dom";

export default function Inside() {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate("/auth"); 
  };
  return (
    <section id="blog" className="py-9 px-6 md:px-20 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:w-1/2">
          <img
            src="/logos/blog.png" 
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
        </div>
      </div>
    </section>
  );
}
