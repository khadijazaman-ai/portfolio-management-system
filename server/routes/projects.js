const router = require('express').Router();
const Project = require('../models/Project');
const auth = require('../middleware/authMiddleware');

// GET all projects (Authenticated & supports search + filters)
router.get('/', auth, async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = { user: req.user };

    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { technologies: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query);
    res.json(projects);
  } catch (err) {
    console.error('Fetch projects error:', err);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
});

// ADD project (Authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, technologies, category, imageUrl, githubLink, githubUrl, liveLink, liveUrl, status } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const gUrl = githubUrl || githubLink || '';
    const lUrl = liveUrl || liveLink || '';

    const project = new Project({
      user: req.user,
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
      category: category || 'Web Development',
      imageUrl: imageUrl || '',
      githubLink: gUrl,
      githubUrl: gUrl,
      liveLink: lUrl,
      liveUrl: lUrl,
      status: status || 'Completed'
    });

    await project.save();

    const Activity = require('../models/Activity');
    await new Activity({
      user: req.user,
      action: 'Created Project',
      details: project.title
    }).save();

    res.status(201).json(project);
  } catch (err) {
    console.error('Add project error:', err);
    res.status(500).json({ message: 'Server error adding project' });
  }
});

// UPDATE project (Authenticated)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, technologies, category, imageUrl, githubLink, githubUrl, liveLink, liveUrl, status } = req.body;
    
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to update this project' });
    }

    const gUrl = githubUrl !== undefined ? githubUrl : (githubLink !== undefined ? githubLink : project.githubUrl);
    const lUrl = liveUrl !== undefined ? liveUrl : (liveLink !== undefined ? liveLink : project.liveUrl);

    const updates = {
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : undefined,
      category,
      imageUrl,
      githubLink: gUrl,
      githubUrl: gUrl,
      liveLink: lUrl,
      liveUrl: lUrl,
      status
    };

    // Clean undefined keys
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    const Activity = require('../models/Activity');
    await new Activity({
      user: req.user,
      action: 'Updated Project',
      details: project.title
    }).save();

    res.json(project);
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ message: 'Server error updating project' });
  }
});

// DELETE project (Authenticated)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to delete this project' });
    }

    const Activity = require('../models/Activity');
    await new Activity({
      user: req.user,
      action: 'Deleted Project',
      details: project.title
    }).save();

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ message: 'Server error deleting project' });
  }
});

module.exports = router;
