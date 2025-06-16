  // src/context/AuthContext.jsx
  import { createContext, useContext, useEffect, useState } from "react";
  import apiService from "../api/apiService";

  const AuthContext = createContext();

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    const login = async (email, password) => {
      try {
        const res = await apiService.post("/auth/login", { email, password });
        const { user, token } = res.data;
        localStorage.setItem("authToken", token);
        setUser(user);

      } catch (err) {
        console.error("Login failed:", err.response?.data || err.message);
        throw err; // rethrow to be caught in AuthForm
      }
    };

    const signup = async (formData) => {
      try {
        const res = await apiService.post("/auth/signup", formData);
        return res.data;
      } catch (err) {
        console.error("Signup failed:", err.response?.data || err.message);
        throw err;
      }
    };

    const logout = () => {
      localStorage.removeItem("authToken");
      setUser(null);
    };

    const getProfile = async () => {
      try {
        const res = await apiService.get("/auth/me");
        setUser(res.data);
      } catch {
        logout();
      } finally {
        setLoading(false); // done loading
      }
    };

    useEffect(() => {
      const token = localStorage.getItem("authToken");
      if (token) {
        getProfile();
      } else {
        setLoading(false); // no token, no need to load
      }
    }, []);

    return (
      <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };

  export const useAuth = () => useContext(AuthContext);
