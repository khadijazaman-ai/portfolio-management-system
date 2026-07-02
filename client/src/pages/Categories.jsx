import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/projectApi';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { 
  Plus, 
  X, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Edit,
  Trash2,
  Layers,
  FolderOpen
} from 'lucide-react';

export default function Categories() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form & Modal states
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null); // category ID to delete

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to fetch categories.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { name: name.trim() };

      if (editId) {
        await updateCategory(editId, payload);
        setSuccess('Category updated successfully!');
      } else {
        await createCategory(payload);
        setSuccess('Category created successfully!');
      }
      
      closeFormModal();
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error processing request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await deleteCategory(id);
      setSuccess(res.message || 'Category deleted successfully.');
      setShowConfirmDelete(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error deleting category.');
    }
  };

  const openFormModal = (cat = null) => {
    setError('');
    if (cat) {
      setEditId(cat._id);
      setName(cat.name);
    } else {
      setEditId(null);
      setName('');
    }
    setShowModal(true);
  };

  const closeFormModal = () => {
    setShowModal(false);
    setName('');
    setEditId(null);
  };

  return (
    <div className="space-y-8 relative max-w-5xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Layers className="h-8 w-8 text-primary" />
            Categories Management
          </h1>
          <p className="text-text-muted mt-1.5 text-sm sm:text-base">
            Create, update, and delete custom categories to organize your projects portfolio dynamically.
          </p>
        </div>

        <button
          onClick={() => openFormModal()}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-danger/10 border border-danger/25 text-danger px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-success/10 border border-success/25 text-success px-4 py-3 rounded-xl flex items-center gap-3">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {/* Categories Grid/Table List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoadingSkeleton count={4} />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-primary/5 rounded-full border border-primary/10 text-primary mb-4">
            <FolderOpen className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-text">No custom categories found</h3>
          <p className="text-text-muted text-sm mt-1 max-w-md">
            Seeded categories are read-only fallback values. Register a custom category to begin organizing your work.
          </p>
          <button
            onClick={() => openFormModal()}
            className="mt-5 text-sm font-bold text-primary hover:underline cursor-pointer"
          >
            Create your first category now &rarr;
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg/60 border-b border-border text-xs font-bold uppercase tracking-wider text-text-muted">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">URL Slug</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {categories.map((cat, idx) => (
                  <motion.tr
                    key={cat._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-bg/25 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-text text-sm sm:text-base">{cat.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-bg/80 border border-border/80 px-2 py-1 rounded text-primary font-semibold">
                        {cat.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted">
                      {new Date(cat.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openFormModal(cat)}
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg border border-transparent hover:border-primary/10 transition-all cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => setShowConfirmDelete(cat._id)}
                          className="p-2 text-text-muted hover:text-danger hover:bg-danger/5 rounded-lg border border-transparent hover:border-danger/10 transition-all cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-bg/25">
              <h2 className="font-bold text-lg text-text">
                {editId ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={closeFormModal}
                className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-border transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cloud Engineering"
                  className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-text text-sm transition-all"
                  maxLength={50}
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end items-center gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text border border-border rounded-xl hover:bg-bg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2 rounded-xl text-sm shadow-md transition-all duration-150 cursor-pointer"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirm Delete Alert Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3 text-warning">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h3 className="text-lg font-bold text-text">Are you absolutely sure?</h3>
            </div>
            
            <p className="text-sm text-text-muted leading-relaxed">
              Deleting this category will remove it permanently. 
              Any projects currently assigned to it will be reassigned to the default <strong>"Uncategorized"</strong> group to protect your data.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text border border-border rounded-xl hover:bg-bg transition-all cursor-pointer"
              >
                No, Keep It
              </button>
              <button
                onClick={() => handleDelete(showConfirmDelete)}
                className="px-5 py-2 text-sm font-semibold bg-danger hover:bg-danger-dark text-white rounded-xl shadow-md transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
