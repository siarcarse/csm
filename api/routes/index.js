import usersAPI from './users/users-api'
import roleAPI from './role/role-api'
import levelAPI from './level/level-api'
import lessonAPI from './lesson/lesson-api'
import coursesAPI from './courses/courses-api'
import course_lessonAPI from './course_lesson/course_lesson-api'
import course_studentAPI from './course_student/course_student-api'
import course_lesson_teacherAPI from './course_lesson_teacher/course_lesson_teacher-api'
import studentAPI from './student/student-api'
import teacherAPI from './teacher/teacher-api'
import parentAPI from './parent/parent-api'

const rulesAPI = [].concat(
    usersAPI,
    roleAPI,
    levelAPI,
    lessonAPI,
    studentAPI,
    teacherAPI,
    coursesAPI,
    parentAPI,
    course_lessonAPI,
    course_studentAPI,
    course_lesson_teacherAPI
);
export default rulesAPI;
