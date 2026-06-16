import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { 
  Plus, 
  Cpu, 
  X, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Edit,
  Trash2,
  Sliders
} from 'lucide-react';

export default function Skills() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Category filter state
  const [activeCategory, setActiveCategory] = useState('All');

  // Form & Modal states
  const [form, setForm] = useState({ name: '', category: 'Frontend', proficiency: 80 });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const predefinedCategories = ['Frontend', 'Backend', 'AI/ML', 'DevOps', 'Tools'];

  // List of all unique categories in database + predefined ones
  const getCategoriesList = () => {
    const list = new Set(['All', ...predefinedCategories]);
    skills.forEach(s => {
      if (s.category) list.add(s.category);
    });
    return Array.from(list);
  };

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/skills`, { headers });
      setSkills(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to fetch skills.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) {
      setError('Skill name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        proficiency: Number(form.proficiency)
      };

      if (editId) {
        await axios.put(`${API_URL}/api/skills/${editId}`, payload, { headers });
        setSuccess('Skill updated successfully!');
      } else {
        await axios.post(`${API_URL}/api/skills`, payload, { headers });
        setSuccess('Skill added successfully!');
      }
      
      closeFormModal();
      fetchSkills();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save skill.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (skill) => {
    setForm({
      name: skill.name,
      category: skill.category || 'Frontend',
      proficiency: skill.proficiency !== undefined ? skill.proficiency : (skill.level === 'Advanced' ? 90 : skill.level === 'Intermediate' ? 65 : 30)
    });
    setEditId(skill._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${API_URL}/api/skills/${id}`, { headers });
      setSuccess('Skill deleted successfully!');
      fetchSkills();
    } catch (err) {
      console.error(err);
      setError('Failed to delete skill.');
    }
  };

  const openAddModal = () => {
    setForm({ name: '', category: 'Frontend', proficiency: 80 });
    setEditId(null);
    setShowModal(true);
  };

  const closeFormModal = () => {
    setForm({ name: '', category: 'Frontend', proficiency: 80 });
    setEditId(null);
    setShowModal(false);
  };

  // Filter skills based on tab selection
  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(s => (s.category || 'General').toLowerCase() === activeCategory.toLowerCase());

  const getProficiencyColor = (val) => {
    if (val >= 80) return 'bg-secondary';
    if (val >= 40) return 'bg-primary';
    return 'bg-success';
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
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Skills Registry</h1>
          <p className="text-text-muted mt-1 text-sm font-medium">
            List your technologies, frameworks, and tools. Specify your proficiency levels.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary hover:to-primary-dark text-white font-semibold text-sm px-4.5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Skill
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

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-border">
        {getCategoriesList().map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all border cursor-pointer ${
              activeCategory === cat 
                ? 'bg-primary text-white border-primary shadow-sm' 
                : 'bg-surface text-text-muted border-border hover:bg-border/30 hover:text-text'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Table List */}
      {loading && skills.length === 0 ? (
        <LoadingSkeleton count={5} />
      ) : filteredSkills.length > 0 ? (
        <div className="clay-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/80 text-text-muted text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Skill Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Proficiency</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {filteredSkills.map((skill) => {
                  const val = skill.proficiency !== undefined ? skill.proficiency : (skill.level === 'Advanced' ? 90 : skill.level === 'Intermediate' ? 65 : 30);
                  return (
                    <tr 
                      key={skill._id} 
                      className="hover:bg-surface/65 transition-colors cursor-pointer group"
                      onClick={() => handleEdit(skill)}
                    >
                      {/* Name */}
                      <td className="py-4 px-6 font-bold text-text group-hover:text-primary transition-colors">
                        {skill.name}
                      </td>
                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-bg text-text-muted border border-border">
                          {skill.category || 'Frontend'}
                        </span>
                      </td>
                      {/* Proficiency Progress Bar */}
                      <td className="py-4 px-6 min-w-[180px]">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-border/60 rounded-full h-2 overflow-hidden shrink-0">
                            <div 
                              className={`h-full rounded-full ${getProficiencyColor(val)}`}
                              style={{ width: `${val}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-text-muted">{val}%</span>
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-all cursor-pointer"
                            title="Edit Skill"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(skill._id)}
                            className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-all cursor-pointer"
                            title="Delete Skill"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-16 rounded-2xl bg-surface/30 border border-dashed border-border text-center">
          <Cpu className="h-10 w-10 text-text-muted/60 mx-auto mb-4" />
          <h3 className="text-base font-bold text-text mb-1">No skills registered here</h3>
          <p className="text-text-muted text-xs max-w-sm mx-auto mb-6">
            Register your technical competencies for this category to feature them on your public site.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            Create Your First Skill
          </button>
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Modal Backdrop */}
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeFormModal}></div>
          
          {/* Modal Panel */}
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10 animate-scale-in">
            <button 
              onClick={closeFormModal} 
              className="absolute top-4 right-4 p-1 text-text-muted hover:text-text rounded-lg hover:bg-border/40"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Cpu className="h-5 w-5 text-primary" />
              {editId ? 'Modify Skill Details' : 'Register New Skill'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Skill Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Skill Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  placeholder="e.g. React.js, Python, Kubernetes"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Skill Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                >
                  {predefinedCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {/* Option for other if not in list */}
                  {!predefinedCategories.includes(form.category) && (
                    <option value={form.category}>{form.category}</option>
                  )}
                </select>
              </div>

              {/* Proficiency Slider (0-100) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                    <Sliders className="h-3.5 w-3.5 text-text-muted/60" />
                    Proficiency Percentage
                  </label>
                  <span className="text-xs font-bold text-primary">{form.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.proficiency}
                  onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[9px] text-text-muted mt-1.5 font-bold">
                  <span>BEGINNER</span>
                  <span>INTERMEDIATE</span>
                  <span>ADVANCED</span>
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
                    <>{editId ? 'Update Skill' : 'Create Skill'}</>
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
