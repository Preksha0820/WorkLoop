// src/components/HowItWorks.jsx

export default function Demo() {
  return (
    <section className=" py-16 px-20 text-center">
      <h2 className="text-4xl font-extrabold text-blue-900 mb-6">How It Works</h2>
      <p className="text-gray-700 max-w-3xl mx-auto mb-12">
        Teamsync helps you manage tasks easily. Here's how you can get started in just a few steps:
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 max-w-6xl mx-auto">
        {/* Step 1 */}
        <div className="bg-white p-6 rounded-xl shadow-md text-left flex-1 max-w-sm">
          <div className="text-3xl font-bold text-white bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            1
          </div>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Sign Up</h3>
          <p className="text-gray-600">
            Create your free account and set up your organization profile in minutes.
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-xl shadow-md text-left flex-1 max-w-sm">
          <div className="text-3xl font-bold text-white bg-pink-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            2
          </div>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Add Team & Tasks</h3>
          <p className="text-gray-600">
            Invite team members and assign them tasks using our intuitive dashboard.
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 rounded-xl shadow-md text-left flex-1 max-w-sm">
          <div className="text-3xl font-bold text-white bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            3
          </div>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Track & Deliver</h3>
          <p className="text-gray-600">
            Monitor task progress, submit daily reports, and collaborate in real-time.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12">
        <p className="text-lg text-gray-800 mb-4">Still exploring? Book a demo with our expert.</p>
        <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg text-lg transition">
          Request a Demo
        </button>
      </div>
    </section>
  );
}
