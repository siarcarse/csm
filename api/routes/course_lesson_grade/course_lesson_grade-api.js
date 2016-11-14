import Joi from 'joi';
import Boom from 'boom';

const course_lesson_grade = [{
    method: 'GET',
    path: '/api/course_lesson_grade/{course_lesson}',
    config: {
        handler: (request, reply) => {
          let sql = `SELECT max(index) AS index, json_agg(json_build_object('id', id, 'student', student, 'grade', grade, 'index', index)) AS grades
                     FROM course_lesson_grade 
                     WHERE course_lesson=$1`
            request.pg.client.query(sql, [encodeURIComponent(request.params.course_lesson)], (err, result) => {
                let course_lesson_grade = result.rows[0];
                return reply(course_lesson_grade);
            })
        },
        validate: {
            params: {
                course_lesson: Joi.number().min(0)
            }
        }
    }
},{
    method: 'GET',
    path: '/api/course_lesson_grade/{course}/teacher/{teacher}',
    config: {
        handler: (request, reply) => {
            request.pg.client.query(select, (err, result) => {
                let course_lesson_grade = result.rows;
                return reply(course_lesson_grade);
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
    path: '/api/course_lesson_grade',
    config: {
        handler: (request, reply) => {
            let course_lesson = request.payload.course_lesson;
            let date = request.payload.date;
            let teacher = request.payload.teacher;
            let grades = JSON.parse(request.payload.grades);
            let querys = "";
            grades.forEach(function(obj) {
                querys += "INSERT INTO course_lesson_grade (course_lesson, teacher, date, student, index, grade) VALUES (" + course_lesson + ", " + teacher + ", '" + date + "', " + obj.student + ", " + obj.index + ", " + obj.grade + ");";
            });
            request.pg.client.query(querys, (err, result) => {
                if (err) {
                    reply({ message: err });
                } else {
                    reply({ message: result });
                }
            })
        },
        validate: {
            payload: Joi.object().keys({
                course_lesson: Joi.number().required().min(1),
                date: Joi.string().required(),
                teacher: Joi.number().required().min(1),
                grades: Joi.string().required()
            })
        }
    }
}, {
    method: 'PUT',
    path: '/api/course_lesson_grade/{id}',
    config: {
        handler: (request, reply) => {
            let id = encodeURIComponent(request.params.id);
            let year = request.payload.year;
            let level = request.payload.level;
            let sql = ``;
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
    path: '/api/course_lesson_grade',
    config: {
        handler: (request, reply) => {
            let id = request.payload.id;
            let sql = `DELETE FROM course_lesson_grade WHERE id = $1`;
            request.pg.client.query(sql, [id], (err, result) => {
                if (err) {
                    reply({ message: err });
                } else {
                    reply({ message: result });
                }
            })
        },
        validate: {
            payload: Joi.object().keys({
                id: Joi.number().required()
            })
        }
    }
}];
export default course_lesson_grade;
