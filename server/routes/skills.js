const router = require('express').Router();
const Skill = require('../models/Skill');
const auth = require('../middleware/authMiddleware');

// GET all skills (Authenticated)
router.get('/', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user });
    res.json(skills);
  } catch (err) {
    console.error('Fetch skills error:', err);
    res.status(500).json({ message: 'Server error fetching skills' });
  }
});

// ADD skill (Authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, level, proficiency } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    let finalProf = 75;
    let finalLvl = 'Intermediate';

    if (proficiency !== undefined) {
      finalProf = Number(proficiency);
      finalLvl = finalProf >= 80 ? 'Advanced' : finalProf >= 40 ? 'Intermediate' : 'Beginner';
    } else if (level !== undefined) {
      finalLvl = level;
      finalProf = level === 'Advanced' ? 90 : level === 'Intermediate' ? 65 : 30;
    }

    const skill = new Skill({
      user: req.user,
      name,
      category: category || 'Frontend',
      level: finalLvl,
      proficiency: finalProf
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    console.error('Add skill error:', err);
    res.status(500).json({ message: 'Server error adding skill' });
  }
});

// UPDATE skill (Authenticated)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, category, level, proficiency } = req.body;
    
    // Check if skill exists and belongs to the user
    let skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (skill.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to update this skill' });
    }

    const updates = { name, category };

    if (proficiency !== undefined) {
      updates.proficiency = Number(proficiency);
      updates.level = updates.proficiency >= 80 ? 'Advanced' : updates.proficiency >= 40 ? 'Intermediate' : 'Beginner';
    } else if (level !== undefined) {
      updates.level = level;
      updates.proficiency = level === 'Advanced' ? 90 : level === 'Intermediate' ? 65 : 30;
    }

    // Clean undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(skill);
  } catch (err) {
    console.error('Update skill error:', err);
    res.status(500).json({ message: 'Server error updating skill' });
  }
});

// DELETE skill (Authenticated)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if skill exists and belongs to the user
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (skill.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to delete this skill' });
    }

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error('Delete skill error:', err);
    res.status(500).json({ message: 'Server error deleting skill' });
  }
});

module.exports = router;
