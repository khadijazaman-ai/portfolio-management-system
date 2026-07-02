import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createProject, getCategories } from '../api/projectApi';
import { 
  FolderGit2, 
  ArrowLeft,
  X, 
  AlertCircle, 
  Tags,
  Link2,
  Plus,
  Loader2
} from 'lucide-react';

export default function AddProject() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(['Web Development', 'Mobile Development', 'AI/ML', 'Other']);
  const statuses = ['Completed', 'In Progress', 'Planned'];

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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch dynamic categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        if (data && data.length > 0) {
          setCategories(data.map(c => c.name));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

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

  const handleImageFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setError('Image file size must be less than 4MB.');
      return;
    }

    setImageFile(file);
    setImageUrlInput('');
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageUrlInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('description', form.description.trim());
    formData.append('category', form.category);
    formData.append('status', form.status);
    formData.append('githubUrl', form.githubUrl.trim());
    formData.append('liveUrl', form.liveUrl.trim());
    formData.append('technologies', JSON.stringify(technologies));

    if (imageFile) {
      formData.append('projectImage', imageFile);
    } else if (imageUrlInput.trim()) {
      formData.append('imageUrl', imageUrlInput.trim());
    }

    try {
      await createProject(formData);
      navigate('/dashboard/projects', { state: { success: 'Project created successfully!' } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save project. Ensure database and networks are correct.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/dashboard/projects')}
          className="p-2 rounded-xl border border-border hover:bg-surface text-text-muted hover:text-text transition-all cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Catalog New Project</h1>
          <p className="text-text-muted mt-1 text-xs">Add a new showcase item to your professional engineering portfolio.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="clay-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Side */}
            <div className="space-y-5">
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
                  placeholder="e.g. Real-Time Chat System"
                />
              </div>

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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Status
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                  <Tags className="h-3.5 w-3.5 text-text-muted/65" />
                  Technologies Used (Press Space or Enter)
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
                    placeholder={technologies.length === 0 ? "e.g. React, Node" : "Add..."}
                  />
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Project Image
                </label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-border mb-3 max-h-40 group">
                    <img 
                      src={imagePreview} 
                      alt="Project Preview" 
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xs transition-opacity duration-200"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="w-full flex flex-col items-center justify-center border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 px-4 py-4 rounded-xl cursor-pointer transition-all">
                      <Plus className="h-5 w-5 text-text-muted mb-1" />
                      <span className="text-xs font-semibold text-text">Choose image file</span>
                      <span className="text-[10px] text-text-muted mt-0.5">Max size 4MB</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileChange} 
                        className="hidden" 
                      />
                    </label>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted/65">
                        <Link2 className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => {
                          setImageUrlInput(e.target.value);
                          setImagePreview(e.target.value);
                        }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
                        placeholder="Or paste an image URL..."
                      />
                    </div>
                  </div>
                )}
              </div>

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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1">
                  <Link2 className="h-3.5 w-3.5 text-text-muted/60" />
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={form.liveUrl}
                  onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  placeholder="https://project-demo.com"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
              Project Description <span className="text-danger">*</span>
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full p-4 rounded-xl glass-input text-sm leading-relaxed"
              placeholder="Describe the target audience, technical challenges, features, and system design..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard/projects')}
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
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
