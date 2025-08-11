import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './../../context/AuthContext';
import { loginUser } from '../../api/authApi';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiShield,
  FiArrowRight,
  FiAlertCircle,
  FiHeart,
  FiMapPin
} from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(email, password);
      console.log('Login response:', data);

      // Merge headOffice into user object
      const userData = {
        ...data.user,
        headOffice: data.user.headOffice || data.headOffice?.id || null
      };

      login(userData, data.token);

      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      if (userData.role === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/mr-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#c71d51] via-[#cc2454] to-[#c71d51] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-medical-pattern opacity-10"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-[#efa102]/20 rounded-full"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/5 rounded-full"></div>
        
        <div className="flex flex-col justify-center items-center text-white p-12 relative z-10">
          {/* Logo */}
          <div className="mb-8 bg-white pb-3 pt-10 px-10">
            <img 
              src="https://gluckscare.com/logo.png" 
              alt="GlucksCare Pharmaceuticals" 
              className="h-20 w-auto mb-6 drop-shadow-lg"
            />
          </div>
          
          {/* Welcome Text */}
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Welcome to GlucksCare Pharmaceuticals
            </h1>
            <p className="text-lg text-white/90 leading-relaxed mb-8">
              Gluckscare Pharmaceuticals is a trusted name in healthcare, dedicated to delivering high-quality, science-backed medicines and wellness solutions.
            </p>
            
            {/* Company Info */}
            <div className="space-y-4 text-white/80">
              <div className="flex items-center justify-center">
                <FiMapPin className="w-5 h-5 mr-2" />
                <span>Headquartered in Noida, India</span>
              </div>
              <div className="flex items-center justify-center">
                <FiHeart className="w-5 h-5 mr-2" />
                <span>Making healthcare accessible & affordable</span>
              </div>
            </div>
          </div>
          
          {/* Mission Statement */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <p className="text-sm text-white/90 text-center leading-relaxed">
              "With a growing portfolio that spans key therapeutic areas from general health and chronic care to specialized formulations, we combine research, innovation, and global manufacturing standards to create products that truly make a difference."
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src="https://gluckscare.com/logo.png" 
              alt="GlucksCare Pharmaceuticals" 
              className="h-16 w-auto mx-auto mb-4"
            />
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#c71d51]/10 to-[#efa102]/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#cc2454]/10 to-[#efa102]/10 rounded-full translate-y-12 -translate-x-12"></div>

            {/* Header */}
            <div className="text-center mb-8 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#c71d51] to-[#cc2454] rounded-2xl mb-4 shadow-lg">
                <FiShield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center animate-shake">
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c71d51] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c71d51] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#c71d51] focus:ring-[#c71d51] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#c71d51] hover:text-[#cc2454] font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#c71d51] to-[#cc2454] text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <FiUser className="mr-2" />
                  Sign In
                  <FiArrowRight className="ml-2" />
                </div>
              )}
            </button>
          </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button className="text-[#c71d51] hover:text-[#cc2454] font-medium transition-colors">
                  Contact Administrator
                </button>
              </p>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
              <FiShield className="w-4 h-4 mr-1" />
              <span>Secured with 256-bit SSL encryption</span>
            </div>
          </div>

          {/* Company Info */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              © 2025 GlucksCare Pharmaceuticals. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style>{`
  .bg-grid-pattern {
    background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
`}</style>

    </div>
  );
};

export default Login;