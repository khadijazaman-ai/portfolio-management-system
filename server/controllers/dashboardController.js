const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Category = require('../models/Category');
const User = require('../models/User');
const Activity = require('../models/Activity');

// GET dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user });
    const skills = await Skill.find({ user: req.user });
    const categoriesCount = await Category.countDocuments({ user: req.user });
    const user = await User.findById(req.user);

    const totalProjects = projects.length;
    const totalSkills = skills.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;

    // Project categories counts
    const categoryCounts = {};
    projects.forEach(p => {
      const cat = p.category || 'Web Development';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Tech frequencies
    const techFrequency = {};
    projects.forEach(p => {
      if (Array.isArray(p.technologies)) {
        p.technologies.forEach(tech => {
          const cleanTech = tech.trim();
          if (cleanTech) {
            techFrequency[cleanTech] = (techFrequency[cleanTech] || 0) + 1;
          }
        });
      }
    });

    const topTechnologies = Object.keys(techFrequency)
      .sort((a, b) => techFrequency[b] - techFrequency[a])
      .slice(0, 6);

    // Profile completeness checking
    let completeness = 0;
    if (user) {
      const fieldsToCheck = [
        'name', 'email', 'about', 'role', 'tagline', 'profileImage', 
        'education', 'careerGoals', 'interests', 'location', 
        'phone', 'linkedin', 'github', 'website'
      ];
      let filledCount = 0;
      fieldsToCheck.forEach(field => {
        if (user[field] && typeof user[field] === 'string' && user[field].trim() !== '') {
          filledCount++;
        } else if (user[field] && typeof user[field] !== 'string') {
          filledCount++;
        }
      });
      completeness = Math.round((filledCount / fieldsToCheck.length) * 100);
    }

    res.json({
      totalProjects,
      totalSkills,
      totalCategories: categoriesCount || 4, // Seeded defaults fallback
      completedProjects,
      inProgressProjects,
      categoryCounts,
      topTechnologies,
      userStats: user ? {
        loginCount: user.loginCount || 1,
        registrationDate: user.createdAt,
        completeness
      } : {
        loginCount: 1,
        registrationDate: new Date(),
        completeness: 0
      }
    });
  } catch (err) {
    console.error('Fetch dashboard stats error:', err);
    res.status(500).json({ message: 'Server error computing dashboard analytics' });
  }
};

// GET recent activities feed
exports.getRecentActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(activities);
  } catch (err) {
    console.error('Fetch recent activity error:', err);
    res.status(500).json({ message: 'Server error fetching activity logs' });
  }
};
