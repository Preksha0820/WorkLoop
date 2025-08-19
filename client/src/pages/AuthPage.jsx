import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/common/AuthForm";
import { CheckCircle, Users } from "lucide-react";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [invitationData, setInvitationData] = useState(null);
  const [isVerifyingInvitation, setIsVerifyingInvitation] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Check for invitation token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get('invite');
    
    if (inviteToken && !invitationData) {
      verifyInvitation(inviteToken);
    }
  }, []);

  const verifyInvitation = async (token) => {
    setIsVerifyingInvitation(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004'}/auth/verify-invitation/${token}`);
      const data = await response.json();
      
      if (response.ok) {
        setInvitationData(data);
        setIsSignup(true); // Switch to signup mode
      } else {
        console.error('Invalid invitation:', data.message);
      }
    } catch (error) {
      console.error('Error verifying invitation:', error);
    } finally {
      setIsVerifyingInvitation(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "EMPLOYEE") {
        navigate("/employeeDashboard");
      } else if (user.role === "TEAM_LEAD") {
        navigate("/teamLeadDashboard");
      } else if (user.role === "ADMIN") {
        navigate("/adminDashboard");
      } else {
        navigate("/");
      }
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="w-full max-w-md">
        {/* Mobile Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            
            <div>
              <h1 className="text-3xl font-bold text-blue-900">WorkLoop</h1>
              <p className="text-blue-600 font-medium">Where productivity meets simplicity</p>
            </div>
          </div>
        </div>

        {/* Auth Toggle */}
        <div className="bg-gray-100 p-1 rounded-xl mb-8 shadow-inner flex">
          <button
            onClick={() => setIsSignup(false)}
            className={`w-1/2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              !isSignup
                ? "bg-white text-blue-900 shadow-md transform scale-105"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`w-1/2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isSignup
                ? "bg-white text-blue-900 shadow-md transform scale-105"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isSignup ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-gray-600">
              {isSignup
                ? "Join thousands of productive teams using WorkLoop"
                : "Sign in to continue to your dashboard"}
            </p>
          </div>

          <AuthForm isSignup={isSignup} invitationData={invitationData} />

          {/* Switch Prompt */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                {isSignup ? "Login here" : "Sign up here"}
              </button>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center mb-8">
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
  );
}
