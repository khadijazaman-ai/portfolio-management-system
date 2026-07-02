const Project = require('../models/Project');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const fs = require('fs');
const path = require('path');

// GET all projects (supports search & filters)
exports.getProjects = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = { user: req.user };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { technologies: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Fetch projects error:', err);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
};

// GET single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to view this project' });
    }
    res.json(project);
  } catch (err) {
    console.error('Fetch single project error:', err);
    res.status(500).json({ message: 'Server error fetching project details' });
  }
};

// CREATE new project (with optional file upload)
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, status, githubLink, githubUrl, liveLink, liveUrl } = req.body;
    let { technologies } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Process technologies tags
    if (technologies && typeof technologies === 'string') {
      try {
        technologies = JSON.parse(technologies);
      } catch (e) {
        technologies = technologies.split(',').map(t => t.trim()).filter(Boolean);
      }
    }

    const gUrl = githubUrl || githubLink || '';
    const lUrl = liveUrl || liveLink || '';

    // If file is uploaded via multer, use it; otherwise use text field or default
    let finalImageUrl = req.body.imageUrl || '';
    if (req.file) {
      finalImageUrl = `/uploads/projects/${req.file.filename}`;
    }

    const project = new Project({
      user: req.user,
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
      category: category || 'Web Development',
      imageUrl: finalImageUrl,
      githubLink: gUrl,
      githubUrl: gUrl,
      liveLink: lUrl,
      liveUrl: lUrl,
      status: status || 'Completed'
    });

    await project.save();

    // Log Activity
    await new Activity({
      user: req.user,
      action: 'Created Project',
      details: `Project "${project.title}" was added.`
    }).save();

    // Create Notification
    await new Notification({
      user: req.user,
      message: `Project "${project.title}" was created successfully.`
    }).save();

    res.status(201).json(project);
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ message: 'Server error creating project' });
  }
};

// UPDATE project (with optional file upload)
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to update this project' });
    }

    const { title, description, category, status, githubLink, githubUrl, liveLink, liveUrl } = req.body;
    let { technologies } = req.body;

    if (technologies && typeof technologies === 'string') {
      try {
        technologies = JSON.parse(technologies);
      } catch (e) {
        technologies = technologies.split(',').map(t => t.trim()).filter(Boolean);
      }
    }

    const gUrl = githubUrl !== undefined ? githubUrl : (githubLink !== undefined ? githubLink : project.githubUrl);
    const lUrl = liveUrl !== undefined ? liveUrl : (liveLink !== undefined ? liveLink : project.liveUrl);

    // If file is uploaded via multer, use it; otherwise use existing or body field
    let finalImageUrl = project.imageUrl;
    if (req.file) {
      // Remove old file if it exists locally
      if (project.imageUrl && project.imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', project.imageUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, err => {
            if (err) console.error('Failed to delete old image file:', err);
          });
        }
      }
      finalImageUrl = `/uploads/projects/${req.file.filename}`;
    } else if (req.body.imageUrl !== undefined) {
      finalImageUrl = req.body.imageUrl;
    }

    const updates = {
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : undefined,
      category,
      imageUrl: finalImageUrl,
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

    // Log Activity
    await new Activity({
      user: req.user,
      action: 'Updated Project',
      details: `Project "${project.title}" was updated.`
    }).save();

    // Create Notification
    await new Notification({
      user: req.user,
      message: `Project "${project.title}" was updated successfully.`
    }).save();

    res.json(project);
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ message: 'Server error updating project' });
  }
};

// DELETE project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to delete this project' });
    }

    // Delete local file if it exists
    if (project.imageUrl && project.imageUrl.startsWith('/uploads/')) {
      const imgPath = path.join(__dirname, '..', project.imageUrl);
      if (fs.existsSync(imgPath)) {
        fs.unlink(imgPath, err => {
          if (err) console.error('Failed to delete image file:', err);
        });
      }
    }

    await Project.findByIdAndDelete(req.params.id);

    // Log Activity
    await new Activity({
      user: req.user,
      action: 'Deleted Project',
      details: `Project "${project.title}" was deleted.`
    }).save();

    // Create Notification
    await new Notification({
      user: req.user,
      message: `Project "${project.title}" was deleted successfully.`
    }).save();

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ message: 'Server error deleting project' });
  }
};
