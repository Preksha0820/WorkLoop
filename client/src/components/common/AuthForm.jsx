import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import { IoEyeOutline , IoEyeOffOutline} from "react-icons/io5";


export default function AuthForm({ isSignup }) {
  const { login, signup } = useAuth();
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    companyName: "",
    companyId: "",
    teamLeadId: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        const res = await signup(formData);
        console.log(res);
      } else {
        console.log("Logging in with:", formData.email, formData.password);
        await login(formData.email, formData.password);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignup && (
        <>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
          <select name="role"  className="w-full p-2 border rounded"  onChange={handleChange} value={formData.role}>
            <option value="EMPLOYEE">Employee</option>
            <option value="TEAM_LEAD">Team Lead</option>
            <option value="ADMIN">Admin</option>
          </select>
          {formData.role === "ADMIN" && (
            <input type="text" name="companyName" placeholder="Company Name"  className="w-full p-2 border rounded" onChange={handleChange}/>
          )}
          {formData.role !== "ADMIN" && (
            <input type="text" name="companyId" placeholder="Company ID"  className="w-full p-2 border rounded" onChange={handleChange} />
          )}
          {formData.role === "EMPLOYEE" && (
            <input type="text" name="teamLeadId"  placeholder="Team Lead ID"  className="w-full p-2 border rounded"  onChange={handleChange} />
          )}
        </>
      )}

      <input type="email" name="email"  placeholder="Email"  className="w-full p-2 border rounded" onChange={handleChange} />
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
      <button className="w-full bg-blue-900 text-white py-2 rounded">
        {isSignup ? "Signup" : "Login"}
      </button>
    </form>
  );
}
