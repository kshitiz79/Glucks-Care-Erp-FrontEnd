import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './../../context/AuthContext';
import { loginUser } from '../../api/authApi';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      console.log('Login response:', data);

      // Merge headOffice into user object
      const userData = {
        ...data.user,
        headOffice: data.user.headOffice || data.headOffice?.id || null
      };

    

      login(userData, data.token);

      if (userData.role === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/mr-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;