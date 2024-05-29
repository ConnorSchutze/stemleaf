var db = require('../database/db_connector');

exports.get_instructors = (req, res, next) => {
    let instructors_query;

    if (!req.query.course_name || req.query.course_name === '') {
        instructors_query = 'SELECT * FROM Instructors;';
    } else {
        const course_name = req.query.course_name;
        instructors_query = ` \
            SELECT * FROM Instructors \
            INNER JOIN Courses ON Instructors.course_id = Courses.course_id \
            WHERE Courses.name LIKE '${course_name}%;' \
        `;
    }

    let staff_query = ' \
        SELECT Staff.staff_id, Users.first_name, Users.last_name \
        FROM Staff \
        INNER JOIN Users ON Staff.user_id = Users.user_id; \
    ';

    let courses_query = 'SELECT Courses.name FROM Courses;';

    db.pool.query(instructors_query, (error, rows, fields) => {
        let instructors = rows;
        db.pool.query(staff_query, (error, rows, fields) => {
            let staff = rows;
            db.pool.query(courses_query, (error, rows, fields) => {
                let courses = rows;
                return res.render('pages/instructors', {data: instructors, staff: staff, courses: courses});
            })
        })
    })
};

exports.add_instructor = (req, res, next) => {
    // Add logic to handle adding a new instructor
};

exports.update_instructor = (req, res, next) => {
    // Add logic to handle updating an existing instructor
};

exports.delete_instructor = (req, res, next) => {
    // Add logic to handle deleting an existing instructor
};
