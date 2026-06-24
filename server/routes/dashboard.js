const router = require('express').Router();
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const User = require('../models/User');
const Activity = require('../models/Activity');
const auth = require('../middleware/authMiddleware');

// GET dashboard statistics (Authenticated)
router.get('/stats', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user });
    const skills = await Skill.find({ user: req.user });
    const user = await User.findById(req.user);
    const activities = await Activity.find({ user: req.user }).sort({ createdAt: -1 }).limit(5);

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

    // Extract and compute top technologies frequency
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

    // Sort technologies by frequency
    const topTechnologies = Object.keys(techFrequency)
      .sort((a, b) => techFrequency[b] - techFrequency[a])
      .slice(0, 6); // Top 6 tech

    // Compute profile completeness
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
      completedProjects,
      inProgressProjects,
      categoryCounts,
      topTechnologies,
      recentActivities: activities || [],
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
});

module.exports = router;
