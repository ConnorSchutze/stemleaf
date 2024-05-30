var db = require('../database/db_connector');

exports.get_instructors = (req, res, next) => {
    let instructors_query;

    if (!req.query.course_name || req.query.course_name === '') {
        instructors_query = ` \
            SELECT \
            Instructors.instructor_id AS  id, \
            CONCAT(Users.first_name, ' ', Users.last_name) AS staff, \
            Courses.name AS course, \
            Instructors.staff_bio AS bio \
            FROM Instructors \
            INNER JOIN Courses ON Instructors.course_id = Courses.course_id \
            INNER JOIN Staff ON Instructors.staff_id = Staff.staff_id \
            INNER JOIN Users ON Staff.user_id = Users.user_id \
            ORDER BY id; \
        `;
    } else {
        const course_name = req.query.course_name;
        instructors_query = ` \
            SELECT \
            Instructors.instructor_id AS  id, \
            CONCAT(Users.first_name, ' ', Users.last_name) AS staff, \
            Courses.name AS course, \
            Instructors.staff_bio AS bio \
            FROM Instructors \
            INNER JOIN Courses ON Instructors.course_id = Courses.course_id \
            INNER JOIN Staff ON Instructors.staff_id = Staff.staff_id \
            INNER JOIN Users ON Staff.user_id = Users.user_id \
            WHERE Courses.name LIKE '${course_name}%' \
            ORDER BY id; \
        `;
    }

    let staff_query = ' \
        SELECT Staff.staff_id, Users.first_name, Users.last_name \
        FROM Staff \
        INNER JOIN Users ON Staff.user_id = Users.user_id; \
    ';

    let courses_query = 'SELECT Courses.course_id, Courses.name FROM Courses;';

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
    const { staff_id, course_id, staff_bio } = req.body;

    const add_instructors_query = ` \
        INSERT INTO Instructors (staff_id, course_id, staff_bio) \
        VALUES (?, ?, ?); \
    `

    const new_instructor_data = [staff_id, course_id, staff_bio];

    db.pool.query(add_instructors_query, new_instructor_data, (error, results) => {
        const new_instructor_id = results.insertId;
        let add_instructor_query = ` \
            SELECT \
            Instructors.instructor_id AS id, \
            CONCAT(Users.first_name, ' ', Users.last_name) AS staff, \
            Courses.name AS course, \
            Instructors.staff_bio AS bio \
            FROM Instructors \
            INNER JOIN Courses ON Instructors.course_id = Courses.course_id \
            INNER JOIN Staff ON Instructors.staff_id = Staff.staff_id \
            INNER JOIN Users ON Staff.user_id = Users.user_id \
            WHERE Instructors.instructor_id = ?; \
        `;
        
        db.pool.query(add_instructor_query, [new_instructor_id], (error, rows, fields) => {
            return res.json(rows);
        })
    })
};

exports.update_instructor = (req, res, next) => {
    // Add logic to handle updating an existing instructor
};

exports.delete_instructor = (req, res, next) => {
    // Add logic to handle deleting an existing instructor
};
