import { useState } from "react";
import axios from "axios";

export default function AuthForm({ isSignup }) {
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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignup
      ? "http://localhost:5000/api/auth/signup"
      : "http://localhost:5000/api/auth/login";

    try {
      const { data } = await axios.post(url, formData);
      alert(`${isSignup ? "Signup" : "Login"} successful`);
      console.log(data);
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
          <select name="role" className="w-full p-2 border rounded" onChange={handleChange}>
            <option value="EMPLOYEE">Employee</option>
            <option value="TEAM_LEAD">Team Lead</option>
            <option value="ADMIN">Admin</option>
          </select>
          {formData.role === "ADMIN" && (
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          )}
          {formData.role !== "ADMIN" && (
            <input
              type="text"
              name="companyId"
              placeholder="Company ID"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          )}
          {formData.role === "EMPLOYEE" && (
            <input
              type="text"
              name="teamLeadId"
              placeholder="Team Lead ID"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          )}
        </>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        onChange={handleChange}
      />
      <button className="w-full bg-blue-900 text-white py-2 rounded">
        {isSignup ? "Signup" : "Login"}
      </button>
    </form>
  );
}
