import { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import StatsCard from '../components/StatsCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { 
  FolderGit2, 
  Cpu, 
  UserCheck, 
  Share2, 
  Github, 
  Linkedin, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight,
  Plus,
  Compass,
  Code,
  Sparkles,
  History,
  Clock,
  Copy,
  Check
} from 'lucide-react';

// Custom SVG Donut Chart
function SVGDonutChart({ data, showPreview }) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  if (total === 0) return <div className="text-center text-text-muted py-6">No data available</div>;

  const colors = ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
  const entries = Object.entries(data);

  let accumulatedPercent = 0;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={`flex ${showPreview ? 'flex-col xl:flex-col 2xl:flex-row' : 'flex-col sm:flex-row'} items-center gap-8 justify-center`}>
      {/* SVG Ring */}
      <div className="relative w-36 h-36 shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--color-border)" strokeWidth="10" />
          {entries.map(([cat, count], index) => {
            const percent = count / total;
            const strokeLength = percent * circumference;
            const strokeOffset = circumference - (accumulatedPercent * circumference);
            accumulatedPercent += percent;
            return (
              <circle
                key={cat}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={colors[index % colors.length]}
                strokeWidth="10"
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-300 ease-out hover:stroke-[12px] cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-text leading-none">{total}</span>
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider mt-1">Projects</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2.5 text-xs w-full max-w-[200px]">
        {entries.map(([cat, count], index) => (
          <div key={cat} className="flex items-center justify-between font-semibold">
            <div className="flex items-center gap-2 truncate">
              <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: colors[index % colors.length] }} />
              <span className="text-text-muted truncate">{cat}</span>
            </div>
            <span className="text-text">{count} ({Math.round(count / total * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };
  const { showPreview } = useOutletContext() || {};

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'recently';
    const diff = new Date() - new Date(dateString);
    const secs = Math.floor(diff / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (secs < 60) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'yesterday';
    return `${days}d ago`;
  };

  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [profileRes, statsRes, skillsRes, projectsRes] = await Promise.all([
        axios.get(`${API_URL}/api/portfolio`, { headers }),
        axios.get(`${API_URL}/api/dashboard/stats`, { headers }),
        axios.get(`${API_URL}/api/skills`, { headers }),
        axios.get(`${API_URL}/api/projects`, { headers })
      ]);
      
      setProfile(profileRes.data);
      setStats(statsRes.data);
      setSkills(skillsRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to load dashboard statistics.');
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSeedData = async () => {
    try {
      setSeeding(true);
      setError('');
      await axios.post(`${API_URL}/api/profile/seed`, {}, { headers });
      await fetchDashboardData(false);
      alert('Portfolio demo data seeded successfully!');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to seed portfolio data.');
      }
    } finally {
      setSeeding(false);
    }
  };

  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = ['about', 'role', 'tagline', 'profileImage', 'education', 'careerGoals', 'interests', 'location', 'phone', 'linkedin', 'github', 'website'];
    let filled = 0;
    fields.forEach(field => {
      if (profile[field] && String(profile[field]).trim() !== '') {
        filled++;
      }
    });
    return Math.round((filled / fields.length) * 100);
  };

  const getRecentProjects = () => {
    return projects.slice(-3).reverse();
  };

  const getRecentSkills = () => {
    return skills.slice(-4).reverse();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-border rounded animate-pulse mb-8"></div>
        <LoadingSkeleton type="stats" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-border rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-80 bg-border rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const completionRate = calculateCompletion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-8"
    >
      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Welcome Section */}
      <div className={`flex flex-col ${showPreview ? 'xl:flex-row xl:items-center' : 'md:flex-row md:items-center'} justify-between gap-4 clay-card p-6`}>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text flex items-center gap-2">
            Welcome back, {profile?.name || user?.name}
            <Sparkles className="h-6 w-6 text-warning animate-pulse-slow shrink-0" />
          </h1>
          <p className="text-text-muted mt-1 text-sm font-medium">
            Here's the current health and setup of your portfolio administration hub.
          </p>
        </div>
        
        <div className={`flex flex-col ${showPreview ? 'xl:flex-row xl:items-center' : 'sm:flex-row sm:items-center'} gap-3`}>
          <div className="flex items-center gap-2 bg-bg/50 border border-border px-3 py-1.5 rounded-xl text-xs max-w-[280px] sm:max-w-xs overflow-hidden">
            <span className="text-text-muted select-none truncate shrink-0">Live URL:</span>
            <span className="text-primary truncate select-all">{`${window.location.origin}/portfolio-view/${profile?._id || user?.id || ''}`}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/portfolio-view/${profile?._id || user?.id || ''}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-text-muted hover:text-text cursor-pointer shrink-0"
              title="Copy URL"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          
          <Link
            to={`/portfolio-view/${profile?._id || user?.id || ''}`}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary hover:to-primary-dark text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Share2 className="h-3.5 w-3.5" />
            View Live Site
          </Link>
        </div>
      </div>

      {/* Quick Seeding Alert Banner */}
      {stats?.totalProjects === 0 && stats?.totalSkills === 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              Populate Your Portfolio
            </h3>
            <p className="text-sm text-text-muted">
              Your profile is empty and contains no projects or skills. Click below to seed your account with professional demo data (bio, skills, and projects) to immediately see your portfolio come alive!
            </p>
          </div>
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="shrink-0 bg-primary hover:bg-primary-dark text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {seeding ? 'Seeding Data...' : 'Seed Default Portfolio'}
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${showPreview ? 'xl:grid-cols-2 2xl:grid-cols-4' : 'lg:grid-cols-4'} gap-6`}>
        <StatsCard 
          title="Total Projects" 
          value={stats?.totalProjects || 0} 
          icon={FolderGit2} 
          color="blue"
          description={`${stats?.completedProjects || 0} Completed · ${stats?.inProgressProjects || 0} In Progress`}
        />
        <StatsCard 
          title="Total Skills" 
          value={stats?.totalSkills || 0} 
          icon={Cpu} 
          color="purple"
          description="Distributed across your tabs"
        />
        <StatsCard 
          title="Profile Health" 
          value={`${completionRate}%`} 
          icon={UserCheck} 
          color={completionRate === 100 ? 'green' : 'amber'}
          description={`${12 - Math.round(completionRate / 100 * 12)} remaining parameters`}
        />
        <StatsCard 
          title="User Logins" 
          value={stats?.userStats?.loginCount || 1} 
          icon={Clock} 
          color="green"
          description={`Registered ${stats?.userStats?.registrationDate ? new Date(stats.userStats.registrationDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : 'recently'}`}
        />
      </div>

      {/* Charts / Analytics Section */}
      <div className={`grid grid-cols-1 ${showPreview ? 'xl:grid-cols-3' : 'lg:grid-cols-3'} gap-8`}>
        
        {/* Category breakdown (Donut) */}
        <div className="clay-card p-6 flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-base font-bold text-text mb-1 flex items-center gap-1.5">
              <Compass className="h-4.5 w-4.5 text-primary" />
              Categories Breakdown
            </h3>
            <p className="text-xs text-text-muted mb-6">Distribution of cataloged projects</p>
          </div>
          {stats?.categoryCounts ? (
            <SVGDonutChart data={stats.categoryCounts} showPreview={showPreview} />
          ) : (
            <div className="text-center text-text-muted text-sm py-8">No project category data</div>
          )}
        </div>

        {/* Top Technologies (Horizontal Bar) */}
        <div className={`clay-card p-6 flex flex-col justify-between min-h-[300px] ${showPreview ? 'xl:col-span-2' : 'lg:col-span-2'}`}>
          <div>
            <h3 className="text-base font-bold text-text mb-1 flex items-center gap-1.5">
              <Code className="h-4.5 w-4.5 text-secondary" />
              Top Stack Frequencies
            </h3>
            <p className="text-xs text-text-muted mb-6">Most frequently utilized technologies in your showcase</p>
          </div>
          {stats?.topTechnologies && stats.topTechnologies.length > 0 ? (
            <div className="space-y-4">
              {stats.topTechnologies.map((tech) => {
                // Approximate max value for bar scale
                const count = projects.filter(p => p.technologies?.includes(tech)).length;
                const percent = stats.totalProjects > 0 ? (count / stats.totalProjects) * 100 : 0;
                return (
                  <div key={tech} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text">{tech}</span>
                      <span className="text-text-muted">{count} project{count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-text-muted text-sm py-8">No technology usage details registered</div>
          )}
        </div>

      </div>

      {/* Main Info Columns */}
      <div className={`grid grid-cols-1 ${showPreview ? 'xl:grid-cols-3' : 'lg:grid-cols-3'} gap-8`}>
        
        {/* Main Info Column */}
        <div className={showPreview ? 'xl:col-span-2 space-y-8' : 'lg:col-span-2 space-y-8'}>
          
          {/* Profile Preview Card */}
          <div className="clay-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-text">Profile Information</h3>
              <Link to="/dashboard/profile" className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1">
                Edit Profile <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {profile?.role && (
              <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
                {profile.role}
              </div>
            )}

            {profile?.about ? (
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                {profile.about}
              </p>
            ) : (
              <div className="p-4 rounded-xl bg-surface/40 border border-dashed border-border text-center mb-6">
                <p className="text-text-muted text-xs italic">You haven't written anything about yourself yet.</p>
                <Link to="/dashboard/profile" className="text-xs text-primary hover:underline font-semibold mt-1 inline-block">Add an About section</Link>
              </div>
            )}

            {/* Contact / Location Meta */}
            <div className={`grid grid-cols-1 ${showPreview ? 'xl:grid-cols-2' : 'sm:grid-cols-2'} gap-4 text-xs text-text-muted pt-2 border-t border-border/60`}>
              {profile?.location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-text-muted/60" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-text-muted/60" />
                  <span>{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-text-muted/60" />
                <span className="truncate">{profile?.email}</span>
              </div>
            </div>
          </div>

          {/* Recent Projects Preview */}
          <div className="clay-card p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-text">Recent Projects</h3>
                <p className="text-xs text-text-muted mt-0.5">Your recently updated work items</p>
              </div>
              <Link to="/dashboard/projects" className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1">
                Manage Projects <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {projects.length > 0 ? (
              <div className="space-y-4">
                {getRecentProjects().map((project) => (
                  <div key={project._id} className="p-4 rounded-xl bg-surface/50 border border-border flex items-center justify-between hover:bg-surface transition-colors">
                    <div className="truncate pr-4">
                      <h4 className="text-sm font-bold text-text mb-1">{project.title}</h4>
                      <p className="text-xs text-text-muted truncate">{project.description}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                      project.status === 'Completed' 
                        ? 'bg-success/10 text-success border-success/20' 
                        : project.status === 'In Progress'
                        ? 'bg-warning/10 text-warning border-warning/20'
                        : 'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-surface border border-dashed border-border text-center">
                <p className="text-text-muted text-xs italic mb-3">No projects added yet.</p>
                <Link to="/dashboard/projects" className="inline-flex items-center gap-1.5 text-xs text-white bg-primary px-3 py-1.5 rounded-lg font-medium hover:bg-primary-dark shadow-sm">
                  <Plus className="h-3.5 w-3.5" /> Add Project
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity Timeline */}
          <div className="clay-card p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-text flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Recent Activities
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Timeline of operations performed on your database</p>
              </div>
            </div>

            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:inset-y-1 before:left-[11px] before:w-0.5 before:bg-border/60">
                {stats.recentActivities.map((act) => (
                  <div key={act._id} className="flex gap-4 relative">
                    <div className="h-6 w-6 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 z-10 text-primary bg-slate-900">
                      <Clock className="h-3 w-3" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-primary block leading-none">
                        {act.action}
                      </span>
                      <span className="text-sm font-semibold text-text block mt-1">
                        {act.details}
                      </span>
                      <span className="text-[10px] text-text-muted block mt-0.5">
                        {formatRelativeTime(act.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-text-muted text-sm py-8">
                No recent activity records found.
              </div>
            )}
          </div>
        </div>

        {/* Socials & Skills Column */}
        <div className="space-y-8">
          {/* Social Handles */}
          <div className="clay-card p-6">
            <h3 className="text-base font-bold text-text mb-5">Social Presence</h3>
            
            <div className="space-y-4">
              {/* GitHub */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface rounded-lg text-text-muted border border-border shadow-sm">
                    <Github className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block uppercase font-bold tracking-wide">GitHub</span>
                    {profile?.github ? (
                      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-semibold truncate max-w-[150px] block mt-0.5">
                        Link Connected
                      </a>
                    ) : (
                      <span className="text-xs text-text-muted/60 italic mt-0.5 block">Not Connected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface rounded-lg text-text-muted border border-border shadow-sm">
                    <Linkedin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block uppercase font-bold tracking-wide">LinkedIn</span>
                    {profile?.linkedin ? (
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-semibold truncate max-w-[150px] block mt-0.5">
                        Link Connected
                      </a>
                    ) : (
                      <span className="text-xs text-text-muted/60 italic mt-0.5 block">Not Connected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface rounded-lg text-text-muted border border-border shadow-sm">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block uppercase font-bold tracking-wide">Website</span>
                    {profile?.website ? (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-semibold truncate max-w-[150px] block mt-0.5">
                        {profile.website.replace(/(^\w+:|^)\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-xs text-text-muted/60 italic mt-0.5 block">Not Connected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Skills */}
          <div className="clay-card p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-text">My Skills</h3>
              <Link to="/dashboard/skills" className="text-xs font-semibold text-primary hover:text-primary-dark">
                Manage
              </Link>
            </div>

            {skills.length > 0 ? (
              <div className="space-y-4">
                {getRecentSkills().map((skill) => (
                  <div key={skill._id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text">{skill.name}</span>
                      <span className="text-text-muted">{skill.proficiency}% ({skill.level})</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-secondary rounded-full"
                        style={{ 
                          width: `${skill.proficiency}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-surface border border-dashed border-border text-center">
                <p className="text-text-muted text-xs italic mb-2">No skills registered.</p>
                <Link to="/dashboard/skills" className="text-xs text-primary hover:underline font-semibold">Add your first skill</Link>
              </div>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
}
