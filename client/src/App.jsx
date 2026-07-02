import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import AddProject from './pages/AddProject';
import EditProject from './pages/EditProject';
import Portfolio from './pages/Portfolio';
import PublicPortfolio from './pages/PublicPortfolio';
import Categories from './pages/Categories';
import ChangePassword from './pages/ChangePassword';
import DashboardLayout from './components/DashboardLayout';

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const { token } = useAuth();
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public portfolio view (No auth required) */}
        <Route path="/" element={<PublicPortfolio />} />
        <Route path="/portfolio-view/:userId" element={<PublicPortfolio />} />
        
        {/* Public auth paths */}
        <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />

        {/* Protected workspace paths */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Portfolio />} />
          <Route path="categories" element={<Categories />} />
          <Route path="skills" element={<Skills />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/add" element={<AddProject />} />
          <Route path="projects/edit/:id" element={<EditProject />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
