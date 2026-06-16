import { Edit, Trash2, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SkillCard({ skill, onEdit, onDelete, isReadOnly = false }) {
  const getLevelDetails = (level, prof) => {
    const pValue = prof !== undefined ? prof : (level === 'Advanced' ? 90 : level === 'Intermediate' ? 65 : 30);
    
    if (pValue >= 80) {
      return {
        color: 'from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        barColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
        percent: `${pValue}%`,
        icon: ShieldCheck,
        levelText: level || 'Advanced'
      };
    } else if (pValue >= 40) {
      return {
        color: 'from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        barColor: 'bg-blue-500',
        percent: `${pValue}%`,
        icon: ShieldAlert,
        levelText: level || 'Intermediate'
      };
    } else {
      return {
        color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        barColor: 'bg-emerald-500',
        percent: `${pValue}%`,
        icon: Shield,
        levelText: level || 'Beginner'
      };
    }
  };

  const pVal = skill.proficiency !== undefined ? skill.proficiency : (skill.level === 'Advanced' ? 90 : skill.level === 'Intermediate' ? 65 : 30);
  const levelInfo = getLevelDetails(skill.level, pVal);
  const LevelIcon = levelInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-5 rounded-xl shadow-sm flex flex-col justify-between h-full group"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-surface text-text-muted border border-border uppercase tracking-wider">
            {skill.category || 'General'}
          </span>
          
          {!isReadOnly && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                onClick={() => onEdit(skill)}
                className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                title="Edit Skill"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={() => onDelete(skill._id)}
                className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                title="Delete Skill"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <h3 className="text-base font-bold text-text mb-4 group-hover:text-primary transition-colors duration-200">
          {skill.name}
        </h3>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-text-muted flex items-center gap-1 font-semibold">
            <LevelIcon className="h-3.5 w-3.5 text-text-muted/60" />
            Proficiency
          </span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border bg-gradient-to-r ${levelInfo.color}`}>
            {levelInfo.levelText} ({pVal}%)
          </span>
        </div>
        <div className="w-full bg-border/40 rounded-full h-1.5 overflow-hidden p-[1px]">
          <motion.div
            className={`h-full rounded-full ${levelInfo.barColor}`}
            initial={{ width: 0 }}
            animate={{ width: levelInfo.percent }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
