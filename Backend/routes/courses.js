const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, getRow, run } = require('../database/db');
const auth = require('./auth');

const router = express.Router();

router.post(
  '/',
  auth.verifyToken,
  [
    body('course_name').notEmpty().withMessage('Course name is required'),
    body('description').optional(),
    body('instructor').notEmpty().withMessage('Instructor is required'),
    body('duration').optional(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { course_name, description, instructor, duration } = req.body;

      const result = await run(
        'INSERT INTO courses (course_name, description, instructor, duration) VALUES (?, ?, ?, ?)',
        [course_name, description || null, instructor, duration || null],
      );

      res.status(201).json({
        message: 'Course created successfully',
        course: {
          id: result.id,
          course_name,
          description,
          instructor,
          duration,
        },
      });
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({ error: error.message });
    }
  },
);

router.get('/', async (req, res) => {
  try {
    const courses = await query('SELECT * FROM courses');
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await getRow('SELECT * FROM courses WHERE id = ?', [id]);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put(
  '/:id',
  auth.verifyToken,
  [
    body('course_name')
      .optional()
      .notEmpty()
      .withMessage('Course name cannot be empty'),
    body('description').optional(),
    body('instructor')
      .optional()
      .notEmpty()
      .withMessage('Instructor cannot be empty'),
    body('duration').optional(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { course_name, description, instructor, duration } = req.body;

      const course = await getRow('SELECT * FROM courses WHERE id = ?', [id]);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const updateFields = [];
      const updateValues = [];

      if (course_name) {
        updateFields.push('course_name = ?');
        updateValues.push(course_name);
      }
      if (description) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      if (instructor) {
        updateFields.push('instructor = ?');
        updateValues.push(instructor);
      }
      if (duration) {
        updateFields.push('duration = ?');
        updateValues.push(duration);
      }
      updateValues.push(id);

      const updateQuery = `UPDATE courses SET ${updateFields.join(
        ', ',
      )} WHERE id = ?`;
      await run(updateQuery, updateValues);

      const updatedCourse = await getRow('SELECT * FROM courses WHERE id = ?', [
        id,
      ]);
      res.json({
        message: 'Course updated successfully',
        course: updatedCourse,
      });
    } catch (error) {
      console.error('Update course error:', error);
      res.status(500).json({ error: error.message });
    }
  },
);

router.delete('/:id', auth.verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const course = await getRow('SELECT * FROM courses WHERE id = ?', [id]);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await run('DELETE FROM courses WHERE id = ?', [id]);

    res.json({
      message: 'Course deleted successfully',
      courseId: id,
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
