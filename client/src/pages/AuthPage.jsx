import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/common/AuthForm";
import { ArrowRight, CheckCircle, Users, Calendar, BarChart3 } from "lucide-react";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    { icon: CheckCircle, text: "Task Management Made Simple" },
    { icon: Users, text: "Team Collaboration Tools" },
    { icon: Calendar, text: "Smart Scheduling System" },
    { icon: BarChart3, text: "Performance Analytics" }
  ];

  return (
    <div className="flex h-full bg-gradient-to-br from-blue-50 to-indigo-100 pt-10">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
              <div className="text-3xl font-bold text-blue-900">W</div>
            </div>
            <h1 className="text-4xl font-bold mb-2">WorkLoop</h1>
            <p className="text-blue-200 text-lg">Where productivity meets simplicity</p>
          </div>

          {/* Features */}
          <div className="space-y-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 text-left">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-700 rounded-lg">
                  <feature.icon className="w-6 h-6" />
                </div>
                <span className="text-lg font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center space-x-2 text-blue-200">
            <span>Ready to boost your productivity?</span>
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-900 rounded-xl shadow-lg mb-4 mx-auto">
              <div className="text-2xl font-bold text-white">W</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">WorkLoop</h1>
            <p className="text-gray-600">Where productivity meets simplicity</p>
          </div>

          {/* Auth Toggle */}
          <div className="bg-gray-100 p-1 rounded-xl mb-8 shadow-inner">
            <button
              className={`w-1/2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                !isSignup 
                  ? "bg-white text-blue-900 shadow-md transform scale-105" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setIsSignup(false)}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isSignup 
                  ? "bg-white text-blue-900 shadow-md transform scale-105" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setIsSignup(true)}
            >
              Sign Up
            </button>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isSignup ? "Create your account" : "Welcome back"}
              </h2>
              <p className="text-gray-600">
                {isSignup 
                  ? "Join thousands of productive teams using WorkLoop" 
                  : "Sign in to continue to your dashboard"
                }
              </p>
            </div>
            
            <AuthForm isSignup={isSignup} />
            
            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {isSignup ? "Already have an account? " : "Don't have an account? "}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  {isSignup ? "Sign in here" : "Sign up here"}
                </button>
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Secure & Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">10k+ Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}