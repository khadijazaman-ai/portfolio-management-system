import { Edit, Trash2, Github, ExternalLink, Activity, CheckCircle2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';

export default function ProjectCard({ project, onEdit, onDelete, isReadOnly = false }) {
  const status = project.status || 'Completed';

  const getStatusDetails = (stat) => {
    switch (stat) {
      case 'Completed':
        return {
          bg: 'bg-success/10 text-success border-success/30',
          icon: CheckCircle2,
          colorClass: 'bg-success'
        };
      case 'In Progress':
        return {
          bg: 'bg-warning/10 text-warning border-warning/30 animate-pulse',
          icon: Activity,
          colorClass: 'bg-warning'
        };
      case 'Planned':
      default:
        return {
          bg: 'bg-primary/10 text-primary border-primary/30',
          icon: Calendar,
          colorClass: 'bg-primary'
        };
    }
  };

  const statusInfo = getStatusDetails(status);
  const StatusIcon = statusInfo.icon;

  const githubUrl = project.githubUrl || project.githubLink;
  const liveUrl = project.liveUrl || project.liveLink;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.35 }}
      className="clay-card p-5 flex flex-col justify-between h-full group relative overflow-hidden"
    >
      {/* Decorative Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 -mr-16 -mt-16 transition-all duration-300 ${statusInfo.colorClass}`}></div>

      <div>
        {/* Project Image */}
        {project.imageUrl && (
          <div className="h-40 w-full overflow-hidden rounded-lg mb-4 bg-bg border border-border">
            <img 
              src={project.imageUrl.startsWith('/uploads/') ? `${API_URL}${project.imageUrl}` : project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Header (Status & Operations) */}
        <div className="flex justify-between items-start mb-4">
          <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${statusInfo.bg}`}>
            <StatusIcon className="h-3 w-3" />
            {status}
          </span>

          {!isReadOnly && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <button 
                onClick={() => onEdit(project)}
                className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                title="Edit Project"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={() => onDelete(project._id)}
                className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-text mb-2 group-hover:text-primary transition-colors duration-200">
          {project.title}
        </h3>

        {/* Category Badge */}
        <span className="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded bg-surface border border-border text-text-muted uppercase mb-3 tracking-wide">
          {project.category || 'Web Development'}
        </span>

        {/* Description */}
        <p className="text-text-muted text-xs mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Badges */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-6">
            {project.technologies.map((tech, idx) => (
              <span 
                key={idx} 
                className="text-[9px] font-bold px-2 py-0.5 rounded bg-bg text-text-muted border border-border uppercase"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Links */}
      <div className="flex justify-between items-center border-t border-border pt-4 mt-auto">
        <div className="flex gap-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors font-semibold"
            >
              <Github className="h-4 w-4 text-text-muted/70" />
              Repo
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark transition-colors font-semibold"
            >
              <ExternalLink className="h-4 w-4" />
              Demo
            </a>
          )}
          {!githubUrl && !liveUrl && (
            <span className="text-xs text-text-muted/50 italic">No links</span>
          )}
        </div>

        <span className="text-[10px] text-text-muted font-medium">
          {new Date(project.updatedAt || Date.now()).toLocaleDateString(undefined, {
            month: 'short',
            year: 'numeric'
          })}
        </span>
      </div>
    </motion.div>
  );
}
