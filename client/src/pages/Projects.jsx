import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { 
  Plus, 
  FolderGit2, 
  X, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Tags,
  Link2,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Github,
  RotateCcw
} from 'lucide-react';

export default function Projects() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search and filter states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form states inside modal
  const [projectImage, setProjectImage] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    status: 'Completed',
    githubUrl: '',
    liveUrl: ''
  });
  
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [categories, setCategories] = useState(['Web Development', 'Mobile Development', 'AI/ML', 'Other']);
  const statuses = ['Completed', 'In Progress', 'Planned'];

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`, { headers });
      if (res.data && res.data.length > 0) {
        setCategories(res.data.map(c => c.name));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 1. Debounce Search Input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // 2. Fetch Projects (filtered based on state)
  const fetchFilteredProjects = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/api/projects`;
      const queryParams = [];

      if (debouncedSearch) {
        queryParams.push(`search=${encodeURIComponent(debouncedSearch)}`);
      }
      if (categoryFilter !== 'All') {
        queryParams.push(`category=${encodeURIComponent(categoryFilter)}`);
      }
      if (statusFilter !== 'All') {
        queryParams.push(`status=${encodeURIComponent(statusFilter)}`);
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const res = await axios.get(url, { headers });
      setProjects(res.data);
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

  // Handle tech chip additions
  const handleAddTechChip = (e) => {
    if (e.key === ',' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const chip = techInput.trim().replace(/,/g, '');
      if (chip && !technologies.includes(chip)) {
        setTechnologies([...technologies, chip]);
      }
      setTechInput('');
    }
  };

  const handleRemoveTechChip = (indexToRemove) => {
    setTechnologies(technologies.filter((_, idx) => idx !== indexToRemove));
  };

  const validateUrls = () => {
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    
    if (form.githubUrl && !urlPattern.test(form.githubUrl)) {
      setError('Please enter a valid GitHub repository URL.');
      return false;
    }
    if (form.liveUrl && !urlPattern.test(form.liveUrl)) {
      setError('Please enter a valid Live Demo URL.');
      return false;
    }
    return true;
  };

  const compressImage = (base64Str, maxWidth = 800, maxHeight = 600, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  const handleImageUpload = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setError('Image size must be less than 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      try {
        const compressed = await compressImage(uploadEvent.target.result);
        setProjectImage(compressed);
      } catch (err) {
        setProjectImage(uploadEvent.target.result);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    if (!validateUrls()) return;

    const sanitizeUrl = (url) => {
      if (!url) return '';
      const trimmed = url.trim();
      if (/^https?:\/\//i.test(trimmed)) return trimmed;
      return `https://${trimmed}`;
    };

    setSubmitting(true);
    
    const projectPayload = {
      ...form,
      imageUrl: projectImage,
      githubUrl: sanitizeUrl(form.githubUrl),
      githubLink: sanitizeUrl(form.githubUrl),
      liveUrl: sanitizeUrl(form.liveUrl),
      liveLink: sanitizeUrl(form.liveUrl),
      technologies
    };

    try {
      if (editId) {
        await axios.put(`${API_URL}/api/projects/${editId}`, projectPayload, { headers });
        setSuccess('Project updated successfully!');
      } else {
        await axios.post(`${API_URL}/api/projects`, projectPayload, { headers });
        setSuccess('Project added successfully!');
      }
      
      closeFormModal();
      fetchFilteredProjects();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save project settings.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      category: project.category || 'Web Development',
      status: project.status || 'Completed',
      githubUrl: project.githubUrl || project.githubLink || '',
      liveUrl: project.liveUrl || project.liveLink || ''
    });
    setProjectImage(project.imageUrl || '');
    setTechnologies(project.technologies || []);
    setEditId(project._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    setError('');
    setSuccess('');
    try {
      await axios.delete(`${API_URL}/api/projects/${id}`, { headers });
      setSuccess('Project deleted successfully!');
      fetchFilteredProjects();
    } catch (err) {
      console.error(err);
      setError('Failed to delete project.');
    }
  };

  const openAddModal = () => {
    setForm({
      title: '',
      description: '',
      category: 'Web Development',
      status: 'Completed',
      githubUrl: '',
      liveUrl: ''
    });
    setProjectImage('');
    setTechnologies([]);
    setTechInput('');
    setEditId(null);
    setShowModal(true);
  };

  const closeFormModal = () => {
    setForm({
      title: '',
      description: '',
      category: 'Web Development',
      status: 'Completed',
      githubUrl: '',
      liveUrl: ''
    });
    setProjectImage('');
    setTechnologies([]);
    setTechInput('');
    setEditId(null);
    setShowModal(false);
  };

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
            Manage your portfolios engineering showcase. Add titles, descriptions, and tag stacks.
          </p>
        </div>
        <button
          onClick={openAddModal}
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
                    onClick={() => handleEdit(proj)}
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
                          onClick={() => handleEdit(proj)}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj._id)}
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
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            Add New Project
          </button>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeFormModal}></div>

          {/* Panel */}
          <div className="bg-surface border border-border w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative z-10 animate-scale-in max-h-[90vh] overflow-y-auto">
            <button 
              onClick={closeFormModal} 
              className="absolute top-4 right-4 p-1 text-text-muted hover:text-text rounded-lg hover:bg-border/40"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2 border-b border-border pb-3">
              <FolderGit2 className="h-5 w-5 text-primary" />
              {editId ? 'Modify Project Information' : 'Catalog New Project'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Side fields */}
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      Project Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                      placeholder="e.g. Portfolio Analytics Dashboard"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      Project Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    >
                      {statuses.map(stat => (
                        <option key={stat} value={stat}>{stat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tech stack tags */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                      <Tags className="h-3.5 w-3.5 text-text-muted/65" />
                      Technologies Used (Press Space or Enter to Add)
                    </label>
                    <div className="p-2.5 rounded-xl glass-input flex flex-wrap gap-1.5 items-center min-h-[44px]">
                      {technologies.map((tech, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center gap-1 bg-surface text-text-muted text-[10px] px-2.5 py-0.5 rounded-md border border-border font-bold uppercase"
                        >
                          {tech}
                          <button type="button" onClick={() => handleRemoveTechChip(index)} className="hover:text-danger text-text-muted/60 shrink-0">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={handleAddTechChip}
                        className="bg-transparent border-none outline-none text-xs text-text grow min-w-[100px] py-0.5"
                        placeholder={technologies.length === 0 ? "e.g. React, Docker" : "Add..."}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side fields */}
                <div className="space-y-4">
                  {/* Showcase Image Upload & URL */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1">
                      <FolderGit2 className="h-3.5 w-3.5 text-text-muted/60" />
                      Project Showcase Image
                    </label>

                    {projectImage && (
                      <div className="relative rounded-xl overflow-hidden border border-border mb-3 max-h-40 group">
                        <img 
                          src={projectImage} 
                          alt="Project Preview" 
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setProjectImage('')}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xs transition-opacity duration-200"
                        >
                          Remove Image
                        </button>
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* Local File Selector */}
                      <label className="w-full flex flex-col items-center justify-center border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 px-4 py-3 rounded-xl cursor-pointer transition-all">
                        <Plus className="h-5 w-5 text-text-muted mb-1" />
                        <span className="text-xs font-semibold text-text">Choose local file</span>
                        <span className="text-[10px] text-text-muted mt-0.5">Max size 4MB</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                      </label>

                      {/* URL input */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted/60">
                          <Link2 className="h-3.5 w-3.5" />
                        </div>
                        <input
                          type="url"
                          value={projectImage.startsWith('data:') ? '' : projectImage}
                          onChange={(e) => setProjectImage(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
                          placeholder="Or paste an image URL..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1">
                      <Link2 className="h-3.5 w-3.5 text-text-muted/60" />
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      value={form.githubUrl}
                      onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                      placeholder="https://github.com/username/project"
                    />
                  </div>

                  {/* Live URL */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1">
                      <Link2 className="h-3.5 w-3.5 text-text-muted/60" />
                      Live Application URL
                    </label>
                    <input
                      type="url"
                      value={form.liveUrl}
                      onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                      placeholder="https://project-demo.com"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      required
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full p-4 rounded-xl glass-input text-sm leading-relaxed"
                      placeholder="Explain features, problems solved, and architecture..."
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-5 py-2.5 rounded-xl border border-border hover:bg-border/30 text-text-muted text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary hover:to-primary-dark text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{editId ? 'Update Project' : 'Catalog Project'}</>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </motion.div>
  );
}
