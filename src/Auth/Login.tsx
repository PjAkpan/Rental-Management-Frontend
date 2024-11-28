import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const deviceId = `device_${Math.random().toString(36).substr(2, 9)}`;
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/users/login', {
        email: username, 
        password,
        deviceId,
      });
      console.log(response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6">Log in to access your account and manage your room.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username/Email Field */}
          <div>
            <label className="text-lg text-gray-700 font-semibold">Username (Email)</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="text-lg text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <span
              className="text-blue-600 hover:text-blue-700 cursor-pointer font-semibold text-sm"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-4 transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Log In
          </button>

          {/* Redirect to Signup */}
          <div className="text-center text-gray-600 mt-6">
            Don’t have an account?{' '}
            <span
              className="text-blue-600 hover:text-blue-700 cursor-pointer font-semibold"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
