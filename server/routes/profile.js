const router = require('express').Router();
const User = require('../models/User');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const auth = require('../middleware/authMiddleware');

// GET public profile (Unauthenticated - first user)
router.get('/', async (req, res) => {
  try {
    // Fetch first user in database
    const user = await User.findOne().select('-password');
    if (!user) {
      return res.status(404).json({ message: 'No profile found' });
    }

    const skills = await Skill.find({ user: user._id });
    const projects = await Project.find({ user: user._id });

    res.json({
      user,
      skills,
      projects
    });
  } catch (err) {
    console.error('Fetch public profile error:', err);
    res.status(500).json({ message: 'Server error fetching profile details' });
  }
});

// PUT update basic info (Authenticated)
router.put('/', auth, async (req, res) => {
  try {
    const { name, role, tagline, profileImage } = req.body;
    const updates = { name, role, tagline, profileImage };
    
    // Clean undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Activity = require('../models/Activity');
    await new Activity({ user: req.user, action: 'Updated Profile', details: 'Updated basic profile info' }).save();

    res.json(user);
  } catch (err) {
    console.error('Update profile basic info error:', err);
    res.status(500).json({ message: 'Server error updating profile basic info' });
  }
});

// PUT update biography/about details (Authenticated)
router.put('/about', auth, async (req, res) => {
  try {
    const { about, education, careerGoals, interests } = req.body;
    const updates = { about, education, careerGoals, interests };

    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Activity = require('../models/Activity');
    await new Activity({ user: req.user, action: 'Updated Profile', details: 'Updated biography & education' }).save();

    res.json(user);
  } catch (err) {
    console.error('Update profile about error:', err);
    res.status(500).json({ message: 'Server error updating about section' });
  }
});

// PUT update contact details (Authenticated)
router.put('/contact', auth, async (req, res) => {
  try {
    const { email, phone, location } = req.body;
    const updates = { email, phone, location };

    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Activity = require('../models/Activity');
    await new Activity({ user: req.user, action: 'Updated Profile', details: 'Updated contact details' }).save();

    res.json(user);
  } catch (err) {
    console.error('Update profile contact error:', err);
    res.status(500).json({ message: 'Server error updating contact details' });
  }
});

// PUT update social links (Authenticated)
router.put('/social', auth, async (req, res) => {
  try {
    const { linkedin, github, website } = req.body;
    const updates = { linkedin, github, website };

    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Activity = require('../models/Activity');
    await new Activity({ user: req.user, action: 'Updated Profile', details: 'Updated social links' }).save();

    res.json(user);
  } catch (err) {
    console.error('Update profile social error:', err);
    res.status(500).json({ message: 'Server error updating social links' });
  }
});

// POST seed default portfolio (Authenticated)
router.post('/seed', auth, async (req, res) => {
  try {
    const userId = req.user;
    
    // Check if user already has skills or projects to prevent duplicates
    const skills = await Skill.find({ user: userId });
    const projects = await Project.find({ user: userId });

    if (skills.length > 0 || projects.length > 0) {
      return res.status(400).json({ message: 'Portfolio already contains data. Seeding canceled to prevent duplicates.' });
    }

    // Update user profile fields with defaults
    const defaults = {
      role: 'Front-End Developer & Full-Stack Engineer',
      tagline: 'Designing and building next-generation web applications with clean architecture',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      about: `Motivated Computer Science student with hands-on experience in front-end development and Python programming gained through industry internships. Actively developing full-stack web development skills and exploring AI/ML fundamentals. Committed to writing clean, functional code and delivering practical solutions.`,
      education: 'Bachelor of Science in Computer Science, COMSATS University (2023 - 2027)',
      careerGoals: 'To leverage my development skills to build robust, scalable SaaS solutions and integrate AI/ML algorithms to solve real-world problems.',
      interests: 'Full Stack Development, AI/ML, Open Source Contribution, UI/UX Design',
      location: 'Yarhussain, Swabi, KPK',
      phone: '0346-5586036',
      linkedin: 'https://linkedin.com/in/khadija-zaman',
      github: 'https://github.com/khadijazaman-ai',
      website: 'https://khadijazaman.dev'
    };

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: defaults },
      { new: true, runValidators: true }
    ).select('-password');

    const defaultSkills = [
      { name: 'React.js', category: 'Frontend', level: 'Advanced', proficiency: 90 },
      { name: 'HTML5 / CSS3', category: 'Frontend', level: 'Advanced', proficiency: 95 },
      { name: 'JavaScript', category: 'Frontend', level: 'Advanced', proficiency: 88 },
      { name: 'Node.js & Express', category: 'Backend', level: 'Intermediate', proficiency: 75 },
      { name: 'Python', category: 'AI/ML', level: 'Intermediate', proficiency: 80 },
      { name: 'MongoDB', category: 'Database', level: 'Intermediate', proficiency: 70 },
      { name: 'Docker', category: 'DevOps', level: 'Beginner', proficiency: 45 },
      { name: 'Git & GitHub', category: 'Tools', level: 'Advanced', proficiency: 90 }
    ];

    const defaultProjects = [
      {
        title: 'Personal Portfolio Website',
        description: 'A premium, responsive full-stack portfolio built with React, Node.js, and MongoDB featuring an admin dashboard, stats analytics, and dark/light modes.',
        technologies: ['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        category: 'Web Development',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
        githubLink: 'https://github.com/khadijazaman-ai/portfolio-management-system',
        githubUrl: 'https://github.com/khadijazaman-ai/portfolio-management-system',
        liveLink: 'https://khadijazaman.dev',
        liveUrl: 'https://khadijazaman.dev',
        status: 'Completed'
      },
      {
        title: 'Student Record Management System',
        description: 'Console-based C++ application using object-oriented programming (OOP) principles and file stream handling for secure student academic records storage.',
        technologies: ['C++', 'File Systems', 'OOP'],
        category: 'Other',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
        githubLink: 'https://github.com/khadijazaman-ai/student-records',
        githubUrl: 'https://github.com/khadijazaman-ai/student-records',
        liveLink: '',
        liveUrl: '',
        status: 'Completed'
      },
      {
        title: 'Mobile Attendance App',
        description: 'Flutter-based mobile app for classroom attendance management with automatic CSV export and barcode scanning capabilities.',
        technologies: ['Flutter', 'Dart', 'Firebase'],
        category: 'Mobile Development',
        imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600',
        githubLink: 'https://github.com/khadijazaman-ai/attendance-app',
        githubUrl: 'https://github.com/khadijazaman-ai/attendance-app',
        liveLink: '',
        liveUrl: '',
        status: 'In Progress'
      },
      {
        title: 'Visual Sentiment Classifier',
        description: 'A PyTorch-based neural network model for image-based sentiment prediction, trained on subset ImageNet dataset.',
        technologies: ['Python', 'PyTorch', 'CNN'],
        category: 'AI/ML',
        imageUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=600',
        githubLink: 'https://github.com/khadijazaman-ai/sentiment-classifier',
        githubUrl: 'https://github.com/khadijazaman-ai/sentiment-classifier',
        liveLink: '',
        liveUrl: '',
        status: 'Planned'
      }
    ];

    const Category = require('../models/Category');
    const defaultCategories = [
      { name: 'Web Development', slug: 'web-development' },
      { name: 'Mobile Development', slug: 'mobile-development' },
      { name: 'AI/ML', slug: 'ai-ml' },
      { name: 'Other', slug: 'other' }
    ];

    await Promise.all([
      ...defaultSkills.map(s => new Skill({ ...s, user: userId }).save()),
      ...defaultProjects.map(p => new Project({ ...p, user: userId }).save()),
      ...defaultCategories.map(c => new Category({ ...c, user: userId }).save())
    ]);

    const Activity = require('../models/Activity');
    await new Activity({ user: userId, action: 'Seeded Portfolio', details: 'Loaded default profile database assets' }).save();

    res.json({ success: true, message: 'Default portfolio data seeded successfully!', user });
  } catch (err) {
    console.error('Seeding error:', err);
    res.status(500).json({ message: 'Server error during seeding portfolio defaults' });
  }
});

module.exports = router;
