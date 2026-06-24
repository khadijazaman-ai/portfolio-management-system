import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Cpu, 
  FolderGit2, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Bell,
  Briefcase,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import FloatingPaths from './FloatingPaths';
import PreviewFrame from './PreviewFrame';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [previewWidth, setPreviewWidth] = useState(() => {
    return parseInt(localStorage.getItem('previewWidth')) || 480;
  });
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 320 && newWidth <= Math.min(1000, window.innerWidth * 0.6)) {
        setPreviewWidth(newWidth);
        localStorage.setItem('previewWidth', newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
    { label: 'Categories', path: '/dashboard/categories', icon: Layers },
    { label: 'Skills', path: '/dashboard/skills', icon: Cpu },
    { label: 'Projects', path: '/dashboard/projects', icon: FolderGit2 },
  ];

  const getPageTitle = () => {
    const activeItem = menuItems.find(item => item.path === location.pathname);
    return activeItem ? activeItem.label : 'Admin Panel';
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="h-screen bg-bg text-text flex overflow-hidden">
      
      {/* Sidebar for Desktop */}
      <aside className={`hidden md:flex flex-col w-64 bg-surface border-r border-border shrink-0 z-20`}>
        {/* Sidebar Header / Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
          <div className="bg-gradient-to-tr from-primary to-secondary p-2 rounded-lg glow-border-blue shrink-0">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PortfolioHub
          </span>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active 
                    ? 'clay-badge text-primary font-bold'
                    : 'text-text-muted hover:bg-surface hover:text-text hover:border-border border border-transparent'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active ? 'text-primary' : 'text-text-muted'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Summary / Logout */}
        <div className="p-4 border-t border-border bg-bg/20">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm shadow">
              {getInitials(user?.name)}
            </div>
            <div className="truncate flex-1">
              <span className="block text-xs font-bold text-text truncate">{user?.name}</span>
              <span className="block text-[10px] text-text-muted truncate">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar for Mobile (Drawer) */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-surface border-r border-border flex flex-col z-40 transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-primary to-secondary p-2 rounded-lg">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PortfolioHub
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-border text-text-muted hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active 
                    ? 'clay-badge text-primary font-bold'
                    : 'text-text-muted hover:bg-surface hover:text-text hover:border-border border border-transparent'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active ? 'text-primary' : 'text-text-muted'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border bg-bg/20">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(user?.name)}
            </div>
            <div className="truncate flex-1">
              <span className="block text-xs font-bold text-text truncate">{user?.name}</span>
              <span className="block text-[10px] text-text-muted truncate">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative overflow-hidden">
        <FloatingPaths />
        {/* Topbar */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 sm:px-6 z-10 shrink-0 sticky top-0 backdrop-blur-md bg-surface/90">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded-lg hover:bg-border text-text-muted hover:text-text md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold text-text hidden sm:block">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Preview Toggle Button */}
            <button
              onClick={() => setShowPreview(prev => !prev)}
              className={`flex items-center gap-1.5 text-xs font-bold border px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                showPreview
                  ? 'bg-primary text-white border-primary shadow'
                  : 'text-text-muted hover:text-text border-border hover:bg-surface/80 bg-bg/40'
              }`}
              title="Toggle Live Split-Preview"
            >
              {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showPreview ? 'Hide Preview' : 'Live Preview'}
            </button>

            {/* View Live Portfolio Link */}
            <Link
              to={`/portfolio-view/${user?.id || ''}`}
              target="_blank"
              className="text-xs font-bold text-primary hover:text-primary-dark border border-primary/20 hover:border-primary/40 px-3 py-1.5 rounded-lg bg-primary/5 transition-all"
            >
              View Live Portfolio
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border hover:bg-bg text-text-muted hover:text-text transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-warning" /> : <Moon className="h-4.5 w-4.5 text-secondary" />}
            </button>

            {/* Notifications (Static Badge) */}
            <button className="p-2 rounded-xl border border-border hover:bg-bg text-text-muted hover:text-text relative transition-all">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-danger"></span>
            </button>

            <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

            {/* User Meta (Desktop) */}
            <div className="items-center gap-2.5 hidden sm:flex">
              <div className="h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                {getInitials(user?.name)}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xs font-semibold text-text">{user?.name}</span>
                <span className="text-[9px] text-text-muted mt-0.5">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content & Preview Split Container */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left: Content View Outlet */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10 custom-scrollbar">
            <Outlet context={{ showPreview }} />
          </main>

          {/* Right: Live Preview Split Pane (Desktops) */}
          {showPreview && (
            <div 
              style={{ width: `${previewWidth}px` }}
              className="hidden lg:flex border-l border-border bg-surface/50 backdrop-blur-md p-4 shrink-0 flex-col z-20 relative animate-in slide-in-from-right duration-300"
            >
              {/* Resize Divider Drag Handle */}
              <div 
                onMouseDown={startResizing}
                className={`absolute top-0 bottom-0 left-0 w-1.5 cursor-col-resize hover:bg-primary/40 transition-colors z-30 flex items-center justify-center group ${isResizing ? 'bg-primary' : ''}`}
                title="Drag to resize preview"
              >
                <div className="w-[2px] h-6 bg-text-muted/30 group-hover:bg-primary/60 rounded-full transition-colors"></div>
              </div>

              {/* Prevent iframe from absorbing mouse events during drag resizing */}
              {isResizing && (
                <div className="absolute inset-0 bg-transparent z-40 cursor-col-resize"></div>
              )}

              <PreviewFrame url={`${window.location.origin}/portfolio-view/${user?.id || ''}?preview=true`} />
            </div>
          )}
        </div>

        {/* Floating overlay drawer for smaller devices */}
        {showPreview && (
          <div className="lg:hidden fixed inset-y-16 right-0 w-full sm:w-[450px] bg-slate-950 border-l border-border p-4 z-35 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <PreviewFrame url={`${window.location.origin}/portfolio-view/${user?.id || ''}?preview=true`} />
          </div>
        )}
      </div>

    </div>
  );
}
