import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; 
import { useNavigate , useLocation } from "react-router-dom";
import { IoEyeOutline , IoEyeOffOutline} from "react-icons/io5";
import { toast } from "react-toastify";


export default function AuthForm({ isSignup, invitationData }) {
  const { login, signup } = useAuth();
  const navigate = useNavigate(); 
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const [showPassword, setShowPassword] = useState(false);
  
  
  const [formData, setFormData] = useState({
    name: "",
    email: email || "",
    password: "",
    role: "EMPLOYEE",
    companyName: "",
    companyId: "",
    teamLeadId: ""
  });

  

  // Update data when invitation data changes
  useEffect(() => {
   
    if (invitationData) {
     
      setFormData(prev => {
        const newData = {
          ...prev,
          email: email ||"",
          companyId: String(invitationData.companyId || prev.companyId),
          companyName: invitationData.companyName || prev.companyName,
          teamLeadId: String(invitationData.teamLeadId || prev.teamLeadId),
          role: "EMPLOYEE"
        };
        
        return newData;
      });
    }
  }, [invitationData, email]);

  

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        const res = await signup(formData);
        toast.success("Signup successful!");
        navigate("/login");
      } else {
        if (!formData.email || !formData.password) {
          toast.error("Email and password are required");
          return;
        }
        const res = await login(formData.email, formData.password);
        toast.success("Login successful!");
    }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {invitationData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <p className="text-blue-800 text-sm">
              You're joining <strong>{invitationData.companyName}</strong> as an employee
            </p>
          </div>
        </div>
      )}
      
      {isSignup && (
        <>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          
          />
          <select 
            name="role"  
            className="w-full p-2 border rounded"  
            onChange={handleChange} 
            value={formData.role}
            disabled={!!invitationData}
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="TEAM_LEAD">Team Lead</option>
            <option value="ADMIN">Admin</option>
          </select>
          {formData.role === "ADMIN" && (
            <input type="text" name="companyName" placeholder="Company Name"  className="w-full p-2 border rounded" onChange={handleChange}/>
          )}
          {formData.role !== "ADMIN" && (
            <input type="text" name="companyId" placeholder="Company ID"  className="w-full p-2 border rounded" onChange={handleChange} value={formData.companyId} readOnly={!!invitationData} />
          )}
          {formData.role === "EMPLOYEE" && (
            <input type="text" name="teamLeadId"  placeholder="Team Lead ID"  className="w-full p-2 border rounded"  onChange={handleChange} value={formData.teamLeadId}  readOnly={!!invitationData}/>
          )}
        </>
      )}

      <input type="email" 
             name="email" 
             placeholder="Email" 
             className="w-full p-2 border rounded" 
             onChange={handleChange} 
             value={formData.email}
             readOnly={!!email}
             disabled={!!invitationData}
             />
      <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    className="w-full p-2 border rounded pr-10"
    onChange={handleChange}
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
  >
    {showPassword ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
  </button>
</div>
      <button className="w-full bg-blue-900 hover:bg-blue-700 text-white py-2 rounded">
        {isSignup ? "Signup" : "Login"}
      </button>
    </form>
  );
}
