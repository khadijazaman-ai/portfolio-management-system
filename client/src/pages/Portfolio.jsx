import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { 
  User, 
  MapPin, 
  Phone, 
  Linkedin, 
  Github, 
  Globe, 
  FileText, 
  Save, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Info,
  Link2,
  GraduationCap,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Portfolio() {
  const { token, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState('basic');
  const [profileImage, setProfileImage] = useState('');
  const [form, setForm] = useState({
    name: '',
    role: '',
    tagline: '',
    about: '',
    education: '',
    careerGoals: '',
    interests: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setError('Image size should be less than 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const compressed = await compressImage(reader.result);
        setProfileImage(compressed);
        setSuccess('Image uploaded and compressed successfully! Save changes to apply.');
      } catch (err) {
        setProfileImage(reader.result);
        setSuccess('Image uploaded successfully! Save changes to apply.');
      }
    };
    reader.onerror = () => {
      setError('Error reading file.');
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/portfolio`, { headers });
        const data = res.data;
        setForm({
          name: data.name || '',
          role: data.role || '',
          tagline: data.tagline || '',
          about: data.about || '',
          education: data.education || '',
          careerGoals: data.careerGoals || '',
          interests: data.interests || '',
          location: data.location || '',
          phone: data.phone || '',
          email: data.email || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          website: data.website || ''
        });
        setProfileImage(data.profileImage || '');
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('Failed to retrieve profile information.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  useEffect(() => {
    if (!loading) {
      window.postMessage({
        type: 'PREVIEW_PROFILE_UPDATE',
        data: {
          ...form,
          profileImage
        }
      }, '*');
    }
  }, [form, profileImage, loading]);

  const validateUrls = (fields) => {
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    
    for (const field of fields) {
      if (form[field] && !urlPattern.test(form[field])) {
        setError(`Please enter a valid URL for ${field}.`);
        return false;
      }
    }
    return true;
  };

  const sanitizeUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const handleSaveSection = async (section) => {
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      let endpoint = `${API_URL}/api/profile`;
      let payload = {};

      if (section === 'basic') {
        if (!form.name.trim()) {
          setError('Name is required.');
          setSubmitting(false);
          return;
        }
        payload = {
          name: form.name,
          role: form.role,
          tagline: form.tagline,
          profileImage: profileImage
        };
      } else if (section === 'about') {
        endpoint = `${API_URL}/api/profile/about`;
        payload = {
          about: form.about,
          education: form.education,
          careerGoals: form.careerGoals,
          interests: form.interests
        };
      } else if (section === 'contact') {
        endpoint = `${API_URL}/api/profile/contact`;
        payload = {
          email: form.email,
          phone: form.phone,
          location: form.location
        };
      } else if (section === 'social') {
        if (!validateUrls(['linkedin', 'github', 'website'])) {
          setSubmitting(false);
          return;
        }
        endpoint = `${API_URL}/api/profile/social`;
        payload = {
          linkedin: sanitizeUrl(form.linkedin),
          github: sanitizeUrl(form.github),
          website: sanitizeUrl(form.website)
        };
      }

      const res = await axios.put(endpoint, payload, { headers });
      
      // Update local storage/context name if it was modified
      if (section === 'basic') {
        updateUser({ name: res.data.name });
      }

      setSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update section settings.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <LoadingSkeleton type="form" />
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Details', icon: User },
    { id: 'about', label: 'Biography & Focus', icon: GraduationCap },
    { id: 'contact', label: 'Contact Settings', icon: MapPin },
    { id: 'social', label: 'Social Networks', icon: Globe }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-text">Profile Administration</h1>
        <p className="text-text-muted mt-1 text-sm font-medium">
          Manage your tagline, about sections, location, and social media handles.
        </p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tab Selection */}
        <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setError(''); setSuccess(''); }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  active 
                    ? 'bg-primary/15 text-primary border border-primary/25 shadow-sm'
                    : 'text-text-muted hover:bg-surface border border-transparent'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Form Panel */}
        <div className="md:col-span-3 clay-card p-6 sm:p-8">
          
          {/* TAB 1: BASIC DETAILS */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-text">Basic Details</h3>
              </div>
 
              {/* Live Image Preview */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-surface/80 border border-border clay-card">
                <div className="h-20 w-20 rounded-full border-2 border-primary/20 overflow-hidden shrink-0 bg-bg flex items-center justify-center shadow-inner">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Avatar Preview" 
                      className="h-full w-full object-cover animate-fade-in"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'; }}
                    />
                  ) : (
                    <User className="h-10 w-10 text-text-muted" />
                  )}
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-bold text-text">Profile Avatar Preview</span>
                  <p className="text-[10px] text-text-muted">Will load immediately from the uploaded file or URL path specified below.</p>
                </div>
              </div>
 
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="Khadija Zaman"
                  />
                </div>
 
                {/* Professional Role */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Professional Title / Role
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="Front-End Developer | Full-Stack Learner"
                  />
                </div>
 
                {/* Tagline */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="Designing and building responsive web applications with clean code"
                  />
                </div>
 
                {/* Profile Image Upload & URL Paste System */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                    Profile Image Upload / Link
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* File Upload Selector */}
                    <div className="clay-card p-4 flex flex-col items-center justify-center text-center border-dashed border-2 border-primary/20 hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label 
                        htmlFor="avatar-upload" 
                        className="cursor-pointer inline-flex flex-col items-center justify-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark"
                      >
                        <div className="p-2 bg-primary/10 rounded-full border border-primary/20">
                          <Upload className="h-4 w-4 text-primary" />
                        </div>
                        <span>Upload Custom Image</span>
                      </label>
                      <span className="text-[9px] text-text-muted mt-1.5">Max size 4MB (PNG, JPG, WEBP)</span>
                    </div>
 
                    {/* Or URL paste */}
                    <div className="clay-card p-4 flex flex-col justify-center gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        Or Paste Image URL
                      </label>
                      <input
                        type="url"
                        value={profileImage.startsWith('data:') ? '' : profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BIOGRAPHY & FOCUS */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-text">Biography & Portfolio Context</h3>
              </div>

              <div className="space-y-4">
                {/* About Bio */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Biography (Bio)
                  </label>
                  <textarea
                    value={form.about}
                    onChange={(e) => setForm({ ...form, about: e.target.value })}
                    rows={4}
                    className="w-full p-4 rounded-xl glass-input text-sm leading-relaxed"
                    placeholder="Detail your experience, internships, and primary technological stack..."
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Education Detail
                  </label>
                  <input
                    type="text"
                    value={form.education}
                    onChange={(e) => setForm({ ...form, education: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="e.g. BS in Computer Science, COMSATS University (2023 - 2027)"
                  />
                </div>

                {/* Career Goals */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Career Goals
                  </label>
                  <textarea
                    value={form.careerGoals}
                    onChange={(e) => setForm({ ...form, careerGoals: e.target.value })}
                    rows={3}
                    className="w-full p-4 rounded-xl glass-input text-sm leading-relaxed"
                    placeholder="e.g. Aiming to expand into full stack development and work in AI applications..."
                  />
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Interests (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.interests}
                    onChange={(e) => setForm({ ...form, interests: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="e.g. Full Stack Development, Deep Learning, Open Source"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT SETTINGS */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-text">Contact Information</h3>
              </div>

              <div className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="0300-1234567"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Physical Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="Swabi, KPK, Pakistan"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOCIAL NETWORKS */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Link2 className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-text">Social Networks</h3>
              </div>

              <div className="space-y-4">
                {/* LinkedIn */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    LinkedIn Handle URL
                  </label>
                  <input
                    type="url"
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                {/* GitHub */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={form.github}
                    onChange={(e) => setForm({ ...form, github: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="https://github.com/username"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Website Portfolio Link
                  </label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="https://mywebsite.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save button footer */}
          <div className="flex justify-end pt-5 border-t border-border mt-8">
            <button
              onClick={() => handleSaveSection(activeTab)}
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary hover:to-primary-dark text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Details...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </div>
      </div>

    </motion.div>
  );
}
