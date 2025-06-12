import { useState } from "react";
import AuthForm from "../components/common/AuthForm";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  
  return (
    <div className="flex min-h-screen">
      {/* Left Side Graphic */}
      <div className="hidden md:flex w-1/2 bg-blue-900 text-white items-center justify-center p-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to WorkLoop</h1>
          <p className="text-lg">Organize tasks and track work efficiently</p>
          <img src="/auth-illustration.svg" alt="TeamSync" className="w-80 mx-auto" />
        </div>
      </div>

      {/* Right Side Auth Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-between mb-6">
            <button
              className={`w-1/2 py-2 rounded-l-md ${!isSignup ? "bg-blue-900 text-white" : "bg-gray-200"}`}
              onClick={() => setIsSignup(false)}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-2 rounded-r-md ${isSignup ? "bg-blue-900 text-white" : "bg-gray-200"}`}
              onClick={() => setIsSignup(true)}
            >
              Signup
            </button>
          </div>
          <AuthForm isSignup={isSignup} />
        </div>
      </div>
    </div>
  );
}
