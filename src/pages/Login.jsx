import React, { useState } from "react";
import logo from "../assets/logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState(""); // eamil = admin@gmail.com
  const [password, setPassword] = useState(""); //password = admin
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
      );
      toast.success("Login Successful!");
      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Login Failed");
    }
  };
  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-sky-200 from-50% to-white-100 to-50% space-y-6">
      <img src={logo} className="w-16 h-16" alt="" />
      <h2 className="font-sans text-3xl text-blue font-bold">
        Employee Managment System
      </h2>
      <div className="border shadow p-6 w-80 bg-white rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* <div className="mb-4 flex items-center justify-between">
            <label className="inline-flex items-center">
              <input type="checkbox" className=" border-blue-100" />
              <span className="ml-2 text-gray-700 text-xs">Remember Me</span>
            </label>
            <Link to="/forgot-password" className="text-blue-500 text-xs hover:underline">Forgot Password?</Link>
          </div> */}
          <button
            type="submit"
            className="hover:bg-blue-700 rounded-full bg-blue-500 py-1 text-white w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
