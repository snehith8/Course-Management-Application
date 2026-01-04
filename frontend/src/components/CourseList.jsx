import '../styles/CourseList.css';

function CourseList({ courses, onEdit, onDelete }) {
  if (courses.length === 0) {
    return (
      <div className="no-courses">
        No courses found. Create your first course!
      </div>
    );
  }

  return (
    <div className="course-list">
      {courses.map((course) => (
        <div key={course.id} className="course-card">
          <div className="course-header">
            <h3>{course.course_name}</h3>
            <div className="course-actions">
              <button className="btn btn-edit" onClick={() => onEdit(course)}>
                Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => onDelete(course.id)}
              >
                Delete
              </button>
            </div>
          </div>
          <p className="course-instructor">
            <strong>Instructor:</strong> {course.instructor}
          </p>
          {course.description && (
            <p className="course-description">
              <strong>Description:</strong> {course.description}
            </p>
          )}
          {course.duration && (
            <p className="course-duration">
              <strong>Duration:</strong> {course.duration}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default CourseList;
