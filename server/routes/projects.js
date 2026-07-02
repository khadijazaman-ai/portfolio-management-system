const router = require('express').Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');
const { uploadProject } = require('../middleware/uploadMiddleware');

// GET all projects
router.get('/', auth, projectController.getProjects);

// GET project by ID
router.get('/:id', auth, projectController.getProjectById);

// ADD new project (protect and upload file)
router.post('/', auth, uploadProject, projectController.createProject);

// UPDATE project (protect and upload file)
router.put('/:id', auth, uploadProject, projectController.updateProject);

// DELETE project
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;
