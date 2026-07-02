import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProjects, deleteProject, getCategories } from '../api/projectApi';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { 
  Plus, 
  FolderGit2, 
  AlertCircle, 
  CheckCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  RotateCcw
} from 'lucide-react';

export default function Projects() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search and filter states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [categories, setCategories] = useState(['Web Development', 'Mobile Development', 'AI/ML', 'Other']);
  const statuses = ['Completed', 'In Progress', 'Planned'];

  // Handle flash message success states from Add/Edit redirects
  useEffect(() => {
    if (location.state?.success) {
      setSuccess(location.state.success);
      // Clean location state history so message doesn't repeat on reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      if (data && data.length > 0) {
        setCategories(data.map(c => c.name));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce Search Input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Projects based on filters
  const fetchFilteredProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (statusFilter !== 'All') params.status = statusFilter;

      const data = await getProjects(params);
      setProjects(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to retrieve projects list.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProjects();
  }, [debouncedSearch, categoryFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setCategoryFilter('All');
    setStatusFilter('All');
  };

  const getStatusBadgeColor = (stat) => {
    switch (stat) {
      case 'Completed':
        return 'bg-success/10 text-success border-success/30';
      case 'In Progress':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'Planned':
      default:
        return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Avoid triggering row edit redirect click
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    setError('');
    setSuccess('');
    try {
      await deleteProject(id);
      setSuccess('Project deleted successfully!');
      fetchFilteredProjects();
    } catch (err) {
      console.error(err);
      setError('Failed to delete project.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Projects Registry</h1>
          <p className="text-text-muted mt-1 text-sm font-medium">
            Manage your portfolio's engineering showcase. Add titles, descriptions, and tag stacks.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/projects/add')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary hover:to-primary-dark text-white font-semibold text-sm px-4.5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Project
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-success text-sm flex items-start gap-3">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="clay-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted/70">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
            placeholder="Search by name or technology..."
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-text-muted" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface text-text text-xs"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface text-text text-xs"
            >
              <option value="All">All Statuses</option>
              {statuses.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(search || categoryFilter !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text px-3 py-1.5 rounded-lg border border-border hover:bg-border/30 transition-all cursor-pointer font-bold"
            >
              <RotateCcw className="h-3 w-3" />
              Clear
            </button>
          )}

        </div>

      </div>

      {/* Projects Table */}
      {loading && projects.length === 0 ? (
        <LoadingSkeleton count={3} />
      ) : projects.length > 0 ? (
        <div className="clay-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/80 text-text-muted text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Project Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Technologies</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {projects.map((proj) => (
                  <tr 
                    key={proj._id} 
                    className="hover:bg-surface/65 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/dashboard/projects/edit/${proj._id}`)}
                  >
                    {/* Title */}
                    <td className="py-4 px-6 font-bold text-text group-hover:text-primary transition-colors">
                      {proj.title}
                    </td>
                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-bg border border-border text-text-muted uppercase tracking-wide">
                        {proj.category || 'Web Development'}
                      </span>
                    </td>
                    {/* Tech tags */}
                    <td className="py-4 px-6 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {proj.technologies?.slice(0, 3).map((tech, idx) => (
                          <span 
                            key={idx} 
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-surface border border-border text-text-muted uppercase"
                          >
                            {tech}
                          </span>
                        ))}
                        {proj.technologies?.length > 3 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 text-text-muted">
                            +{proj.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Status badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${getStatusBadgeColor(proj.status)}`}>
                        {proj.status || 'Completed'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/dashboard/projects/edit/${proj._id}`)}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(proj._id, e)}
                          className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-all cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-16 rounded-2xl bg-surface/30 border border-dashed border-border text-center">
          <FolderGit2 className="h-10 w-10 text-text-muted/60 mx-auto mb-4" />
          <h3 className="text-base font-bold text-text mb-1">No projects found</h3>
          <p className="text-text-muted text-xs max-w-sm mx-auto mb-6">
            Try adjusting your search criteria, category filters, or add a new project to your workspace registry.
          </p>
          <button
            onClick={() => navigate('/dashboard/projects/add')}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            Add New Project
          </button>
        </div>
      )}
    </motion.div>
  );
}
