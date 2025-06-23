
import { NavLink } from "react-router-dom";

export default function Demo() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-blue-600 to-purple-600" id="book-demo">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to boost your productivity?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of teams who have already transformed their workflow with our platform
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg">
            Start Free Trial
          </button>
          <NavLink to="/auth" className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200">
            Schedule Demo
          </NavLink>
        </div>
        
        <p className="text-blue-200 text-sm mt-4">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
