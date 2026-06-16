const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Project = require('../models/Project');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
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
    });

    await user.save();

    // Pre-seed default skills for the registered user
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

    // Pre-seed default projects for the registered user
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

    // Save default entities in parallel
    await Promise.all([
      ...defaultSkills.map(s => new Skill({ ...s, user: user._id }).save()),
      ...defaultProjects.map(p => new Project({ ...p, user: user._id }).save())
    ]);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
