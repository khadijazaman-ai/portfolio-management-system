import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import FloatingPaths from '../components/FloatingPaths';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return false;
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-bg text-text">
      {/* Animated Floating Paths Background */}
      <FloatingPaths />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow z-0" style={{ animationDelay: '1.5s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 12 }}
            className="inline-flex bg-gradient-to-tr from-primary to-secondary p-3.5 rounded-2xl glow-border-blue mb-4 shadow-lg shadow-primary/20"
          >
            <LogIn className="h-7 w-7 text-white" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text">
            Welcome Back
          </h1>
          <p className="text-text-muted mt-2 text-sm font-medium">
            Manage your personal profile, skills, and projects
          </p>
        </div>

        {/* Claymorphic Card Form */}
        <div className="clay-card p-8 shadow-xl border border-border/40">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-text-muted" />
                </div>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-text-muted" />
                </div>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer clay-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Helper links */}
          <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create one now
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
