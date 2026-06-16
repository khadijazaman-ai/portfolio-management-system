import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Cpu, 
  FolderGit2, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X,
  Briefcase
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/portfolio', icon: User },
    { label: 'Skills', path: '/skills', icon: Cpu },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-lg backdrop-blur-md mb-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/login"} className="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight">
            <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-2 rounded-lg glow-border-blue">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              PortfolioHub
            </span>
          </Link>

          {/* Desktop Nav */}
          {user ? (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500 rounded-b-none'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              
              <Link
                to={`/portfolio-view/${user.id}`}
                target="_blank"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-purple-400 hover:bg-purple-950/20 hover:text-purple-300 transition-all border border-purple-500/20 hover:border-purple-500/40"
              >
                <ExternalLink className="h-4 w-4" />
                Live Portfolio
              </Link>

              <div className="h-6 w-px bg-slate-800 mx-2"></div>

              <div className="flex items-center gap-3 pl-2">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-semibold text-slate-200">{user.name}</span>
                  <span className="text-xs text-slate-500">{user.email}</span>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow">
                  {getInitials(user.name)}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow mr-3">
                {getInitials(user.name)}
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-800/95 border-b border-slate-800 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                        isActive(link.path)
                          ? 'bg-blue-600/20 text-blue-400'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
                <Link
                  to={`/portfolio-view/${user.id}`}
                  target="_blank"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-purple-400 hover:bg-purple-950/20"
                >
                  <ExternalLink className="h-5 w-5" />
                  Live Portfolio
                </Link>
                <div className="border-t border-slate-800 my-2 pt-2">
                  <div className="px-3 py-2 flex flex-col mb-2">
                    <span className="text-sm font-semibold text-slate-200">{user.name}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                  <button
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-red-400 hover:bg-red-950/20 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 p-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center px-4 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 border border-slate-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center px-4 py-2.5 rounded-lg text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
