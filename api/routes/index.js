import usersAPI from './users/users-api'
import roleAPI from './role/role-api'
import levelAPI from './level/level-api'
import lessonAPI from './lesson/lesson-api'
import coursesAPI from './courses/courses-api'
import course_lessonAPI from './course_lesson/course_lesson-api'
import studentAPI from './student/student-api'
import parentAPI from './parent/parent-api'

const rulesAPI = [].concat(
    usersAPI,
    roleAPI,
    levelAPI,
    lessonAPI,
    studentAPI,
    coursesAPI,
    parentAPI,
    course_lessonAPI
);
export default rulesAPI;
