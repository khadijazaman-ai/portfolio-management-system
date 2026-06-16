const router = require('express').Router();
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const auth = require('../middleware/authMiddleware');

// GET dashboard statistics (Authenticated)
router.get('/stats', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user });
    const skills = await Skill.find({ user: req.user });

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

    res.json({
      totalProjects,
      totalSkills,
      completedProjects,
      inProgressProjects,
      categoryCounts,
      topTechnologies
    });
  } catch (err) {
    console.error('Fetch dashboard stats error:', err);
    res.status(500).json({ message: 'Server error computing dashboard analytics' });
  }
});

module.exports = router;
