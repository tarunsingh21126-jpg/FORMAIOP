import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Eye, EyeOff } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import LeftUP from './LeftUP';


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

//   const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/rooms');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
   
    <div className="min-h-screen bg-white flex">

      {/* LEFT SIDE */}
      {/* <LeftUP /> */}

      {/* RIGHT SIDE */}
      <section className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-slate-50 px-6 py-10">

        <div className="w-full max-w-xl">

          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xl">⌘</span>
            </div>

            <span className="text-2xl font-bold text-slate-900">
              FORMAIOP
            </span>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 px-7 sm:px-10 py-10">

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#11183d]">
                Login to your account
              </h2>

              <p className="text-slate-500 mt-3">
                Enter your credentials to access your workspace
              </p>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow-sm border border-gray-100 sm:rounded-xl sm:px-10">
                {error && (
                  <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">
                      Email address
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        ✉
                      </span>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-2">
                      Password
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        🔒
                      </span>

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-14 pl-12 pr-12 rounded-xl border border-slate-200 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-slate-400"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600"
                      >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between text-sm">

                    <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-violet-600"
                      />
                      Remember me
                    </label>

                    <div className="mt-6 text-center text-sm">
                      <span className="text-gray-500">Don't have an account? </span>
                      <Link to="/ForgotPassword" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        ForgotPassword
                      </Link>
                    </div>

                  </div>

                  {/* Login */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-60"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-7">
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-sm text-slate-400">
                    Or continue with
                  </span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-4">

                  <button className="h-12 rounded-xl border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center gap-3 font-medium text-slate-700">
                    <span className="font-bold text-red-500">G</span>
                    Google
                  </button>

                  <button className="h-12 rounded-xl border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center gap-3 font-medium text-slate-700">
                    <span className="text-black">●</span>
                    GitHub
                  </button>

                </div>

                {/* Register */}
                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-500">Don't have an account? </span>
                  <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                    Register
                  </Link>
                </div>

              </div>

              {/* Security */}
              <div className="flex justify-center items-center gap-2 mt-6 text-sm text-slate-400">
                <span>🔒</span>
                Your data is secure and encrypted
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}