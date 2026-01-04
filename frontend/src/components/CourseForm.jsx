import { useState, useEffect } from 'react';
import '../styles/CourseForm.css';

function CourseForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    course_name: '',
    description: '',
    instructor: '',
    duration: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      course_name: '',
      description: '',
      instructor: '',
      duration: '',
    });
  };

  return (
    <form className="course-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Course' : 'Add New Course'}</h3>
      <div className="form-group">
        <label>Course Name *</label>
        <input
          type="text"
          name="course_name"
          value={formData.course_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />
      </div>
      <div className="form-group">
        <label>Instructor *</label>
        <input
          type="text"
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Duration</label>
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="e.g., 4 weeks"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {initialData ? 'Update Course' : 'Add Course'}
      </button>
    </form>
  );
}

export default CourseForm;