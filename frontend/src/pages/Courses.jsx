import { useState, useEffect } from 'react';
import api from '../services/api';
import CourseForm from '../components/CourseForm';
import CourseList from '../components/CourseList';
import '../styles/Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (courseData) => {
    try {
      await api.post('/courses', courseData);
      setShowForm(false);
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      await api.put(`/courses/${editingCourse.id}`, courseData);
      setEditingCourse(null);
      setShowForm(false);
      fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${courseId}`);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Course Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingCourse(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : 'Add New Course'}
        </button>
      </div>

      {showForm && (
        <CourseForm
          onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}
          initialData={editingCourse}
        />
      )}

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <CourseList
          courses={courses}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
        />
      )}
    </div>
  );
}

export default Courses;