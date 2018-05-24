import Joi from 'joi';
import Boom from 'boom';
import Moment from 'moment';

const course_lesson = [{
    method: 'GET',
    path: '/api/course_lesson/{param*}',
    config: {
        handler: (request, reply) => {
            var select = `SELECT course_lesson.id, level.name AS course, courses.year, lesson.name AS lesson 
                          FROM course_lesson
                          LEFT JOIN courses ON courses.id=course_lesson.course
                          LEFT JOIN level ON level.id=courses.level
                          LEFT JOIN lesson ON lesson.id=course_lesson.lesson
                          ORDER BY level.id ASC`;
            request.pg.client.query(select, (err, result) => {
                if (err) {
                    return reply(err);
                }
                let course_lesson = result.rows;
                return reply(course_lesson);
            })
        },
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        }
    }
}, {
    method: 'GET',
    path: '/api/course_lesson/{teacher}/teacher/',
    config: {
        handler: (request, reply) => {
            var select = `SELECT course_lesson.id, courses.year, level.name AS course, lesson.name AS lesson
                          FROM course_lesson
                          LEFT JOIN courses ON courses.id=course_lesson.course
                          LEFT JOIN lesson ON lesson.id=course_lesson.lesson
                          LEFT JOIN level ON level.id=courses.level
                          WHERE course_lesson.id IN (SELECT course_lesson FROM course_lesson_teacher WHERE teacher=$1)`;
            request.pg.client.query(select, [encodeURIComponent(request.params.teacher)], (err, result) => {
                let course_lesson = result.rows;
                return reply(course_lesson);
            })
        },
        validate: {
            params: {
                teacher: Joi.number().min(1)
            }
        }
    }
}, {
    method: 'GET',
    path: '/api/course_lesson/{course}/course/',
    config: {
        handler: (request, reply) => {
            /*var select = `SELECT course_lesson.id, level.name AS course, courses.year, lesson.name AS lesson 
                          FROM course_lesson
                          LEFT JOIN courses ON courses.id=course_lesson.course
                          LEFT JOIN level ON level.id=courses.level
                          LEFT JOIN lesson ON lesson.id=course_lesson.lesson
                          WHERE courses.id=$1
                          ORDER BY level.id ASC`;*/
            var select = `SELECT course_lesson.id, level.name AS course, courses.year, lesson.name AS lesson, COUNT(course_lesson_teacher.teacher) AS teachers,
                          COUNT(course_lesson_schedule.course_lesson) AS schedule
                          FROM course_lesson
                          LEFT JOIN courses ON courses.id=course_lesson.course
                          LEFT JOIN level ON level.id=courses.level
                          LEFT JOIN lesson ON lesson.id=course_lesson.lesson
                          LEFT JOIN course_lesson_teacher ON course_lesson_teacher.course_lesson=course_lesson.id
                          LEFT JOIN course_lesson_schedule ON course_lesson_schedule.course_lesson=course_lesson.id
                          WHERE courses.id=$1
                          GROUP BY course_lesson.id, level.name, courses.year, lesson.name, level.id
                          ORDER BY level.id ASC`;
            request.pg.client.query(select, [encodeURIComponent(request.params.course)], (err, result) => {
                let course_lesson = result.rows;
                return reply(course_lesson);
            })
        },
        validate: {
            params: {
                course: Joi.number().min(0)
            }
        }
    }
}, {
    method: 'GET',
    path: '/api/course_lesson/{course}/teacher/{teacher}',
    config: {
        handler: (request, reply) => {
            var year = Moment().format('YYYY');
            if (parseInt(request.params.course) === 0) {
                var select = `SELECT course_lesson.id, level.name AS course, courses.year, lesson.name AS lesson, COUNT(course_lesson_teacher.teacher) AS teachers,
                          COUNT(course_lesson_schedule.course_lesson) AS schedule, , course_lesson.semester
                          FROM course_lesson
                          LEFT JOIN courses ON courses.id=course_lesson.course
                          LEFT JOIN level ON level.id=courses.level
                          LEFT JOIN lesson ON lesson.id=course_lesson.lesson
                          LEFT JOIN course_lesson_teacher ON course_lesson_teacher.course_lesson=course_lesson.id
                          LEFT JOIN course_lesson_schedule ON course_lesson_schedule.course_lesson=course_lesson.id
                          WHERE courses.id=$2 AND courses.year=${year}
                          GROUP BY course_lesson.id, level.name, courses.year, lesson.name, level.id
                          ORDER BY level.id ASC`;
            } else {
                var select = `SELECT course_lesson.id, level.name AS course, courses.year, lesson.name AS lesson, course_lesson.semester FROM course_lesson
                          LEFT JOIN courses ON courses.id=course_lesson.course
                          LEFT JOIN level ON level.id=courses.level
                          LEFT JOIN lesson ON lesson.id=course_lesson.lesson
                          WHERE course_lesson.id IN (
                            SELECT course_lesson FROM course_lesson_teacher WHERE teacher=$1) AND course=$2
                          AND courses.year=${year}`;
            }
            /*var select = `SELECT course_lesson.id, level.name AS course, courses.year, lesson.name AS lesson, COUNT(course_lesson_teacher.teacher) AS teachers, COUNT(course_lesson_schedule.course_lesson) AS schedule
                          FROM course_lesson
                          LEFT JOIN courses ON courses.id=course_lesson.course
                          LEFT JOIN level ON level.id=courses.level
                          LEFT JOIN lesson ON lesson.id=course_lesson.lesson
                          LEFT JOIN course_lesson_teacher ON course_lesson_teacher.course_lesson=course_lesson.id
                          LEFT JOIN course_lesson_schedule ON course_lesson_schedule.course_lesson=course_lesson.id
                          WHERE courses.id=$1
                          GROUP BY course_lesson.id, level.name, courses.year, lesson.name, level.id
                          ORDER BY level.id ASC`;*/
            request.pg.client.query(select, [encodeURIComponent(request.params.teacher), encodeURIComponent(request.params.course)], (err, result) => {
                let course_lesson = result.rows;
                return reply(course_lesson);
            })
        },
        validate: {
            params: {
                course: Joi.number().min(0),
                teacher: Joi.number().min(0)
            }
        }
    }
}, {
    method: 'POST',
    path: '/api/course_lesson',
    config: {
        handler: (request, reply) => {
            let course = request.payload.course;
            let lesson = request.payload.lesson;
            let sql = `INSERT INTO course_lesson (course, lesson)
                        VALUES (${course}, ${lesson})`;
            request.pg.client.query(sql, (err, result) => {
                if (err) {
                    reply({ message: err });
                } else {
                    reply({ message: result });
                }
            })
        },
        validate: {
            payload: Joi.object().keys({
                course: Joi.number().required().min(1),
                lesson: Joi.number().required(),
            })
        }
    }
}, {
    method: 'POST',
    path: '/api/course_lesson/close_semester/',
    config: {
        handler: (request, reply) => {
            let course_lesson = request.payload.course_lesson;
            let semester = request.payload.semester;
            let sql = `UPDATE course_lesson SET semester = ${semester} WHERE id = ${course_lesson}`;
            request.pg.client.query(sql, (err, result) => {
                if (err) {
                    reply({ message: err });
                } else {
                    reply({ message: result });
                }
            })
        },
        validate: {
            payload: Joi.object().keys({
                semester: Joi.number().required().min(1),
                course_lesson: Joi.number().required(),
            })
        }
    }
}, {
    method: 'PUT',
    path: '/api/course_lesson/{id}',
    config: {
        handler: (request, reply) => {
            let id = encodeURIComponent(request.params.id);
            let year = request.payload.year;
            let level = request.payload.level;
            let sql = `UPDATE course_lesson SET level = '${level}', year = '${year}'
                       WHERE id = ${id}`;
            request.pg.client.query(sql, (err, result) => {
                if (err) {
                    reply({ message: err });
                } else {
                    reply({ message: result });
                }
            })
        },
        validate: {
            params: {
                id: Joi.number()
            },
            payload: Joi.object().keys({
                level: Joi.number().required().min(1),
                year: Joi.number().required().min(2016).max(2116),
            })
        }
    }
}, {
    method: 'DELETE',
    path: '/api/course_lesson',
    config: {
        handler: (request, reply) => {
            let course = request.payload.course;
            let lesson = request.payload.lesson;
            let sql = `DELETE FROM course_lesson WHERE course = $1 AND lesson = $2`;
            request.pg.client.query(sql, [course, lesson], (err, result) => {
                if (err) {
                    reply({ message: err });
                } else {
                    reply({ message: result });
                }
            })
        },
        validate: {
            payload: Joi.object().keys({
                course: Joi.number().required(),
                lesson: Joi.number().required(),
            })
        }
    }
}];
export default course_lesson;