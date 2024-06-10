var db = require('../database/db_connector');

// Citation for the following code:
// Date: 05/27/2024
// Adapted from
// Source URL: instructors.js
// Description: Routes, Queries, CRUD

exports.get_enrollments = (req, res, next) => {
    let enrollments_query;

    if (!req.query.last_name || req.query.last_name === '') {
        enrollments_query = ` \
            SELECT \
            Enrollments.enrollment_id AS id, \
            Enrollments.status AS status, \
            Enrollments.grade AS grade, \
            CONCAT(Users.first_name, ' ', Users.last_name) AS user, \
            Courses.name AS course \
            FROM Enrollments \
            INNER JOIN Courses ON Enrollments.course_id = Courses.course_id \
            INNER JOIN Users ON Enrollments.user_id = Users.user_id \
            ORDER BY id; \
        `;
    } else {
        const last_name = req.query.last_name;
        enrollments_query = ` \
            SELECT \
            Enrollments.enrollment_id AS  id, \
            Enrollments.status AS status, \
            Enrollments.grade AS grade, \
            CONCAT(Users.first_name, ' ', Users.last_name) AS user, \
            Courses.name AS course \
            FROM Enrollments \
            INNER JOIN Courses ON Enrollments.course_id = Courses.course_id \
            INNER JOIN Users ON Enrollments.user_id = Users.user_id \
            WHERE Users.last_name LIKE '${last_name}%' \
            ORDER BY id; \
        `;
    }

    let users_query = 'SELECT Users.user_id, Users.first_name, Users.last_name FROM Users';

    let courses_query = 'SELECT Courses.course_id, Courses.name FROM Courses;';

    db.pool.query(enrollments_query, (error, rows, fields) => {
        let enrollments = rows;
        db.pool.query(users_query, (error, rows, fields) => {
            let users = rows;
            db.pool.query(courses_query, (error, rows, fields) => {
                let courses = rows;
                return res.render('pages/enrollments', {data: enrollments, users: users, courses: courses});
            })
        })
    })
};

exports.add_enrollment = (req, res, next) => {
    const { status, grade, user_id, course_id } = req.body;

    const add_enrollments_query = ` \
        INSERT INTO Enrollments (status, grade, user_id, course_id) \
        VALUES (?, ?, ?, ?); \
    `;

    const new_enrollment_data = [status, grade, user_id, course_id];

    db.pool.query(add_enrollments_query, new_enrollment_data, (error, results) => {
        const new_enrollment_id = results.insertId;
        let add_enrollment_query = ` \
            SELECT \
            Enrollments.enrollment_id AS  id, \
            Enrollments.status AS status, \
            Enrollments.grade AS grade, \
            CONCAT(Users.first_name, ' ', Users.last_name) AS user, \
            Courses.name AS course \
            FROM Enrollments \
            INNER JOIN Courses ON Enrollments.course_id = Courses.course_id \
            INNER JOIN Users ON Enrollments.user_id = Users.user_id \
            WHERE Enrollments.enrollment_id = ?; \
        `;

        db.pool.query(add_enrollment_query, [new_enrollment_id], (error, rows, fields) => {
            return res.json(rows);
        })
    })
};

exports.update_enrollment = (req, res, next) => {
    const data = req.body;

    const status = data.status;
    const grade = data.grade;
    const user = data.user;
    const course = data.course;

    const update_enrollment_query = ` \
        UPDATE Enrollments \
        SET status = ?, grade = ? \
        WHERE user_id = ? AND course_id = ?; \
    `;

    const update_enrollment_data = [status, grade, user, course];

    db.pool.query(update_enrollment_query, update_enrollment_data, (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            let get_update_enrollment_query = ` \
            SELECT \
            Enrollments.enrollment_id AS id, \
            Enrollments.status AS status, \
            Enrollments.grade AS grade, \
            CONCAT(Users.first_name, ' ', Users.last_name) AS user, \
            Courses.name AS course \
            FROM Enrollments \
            INNER JOIN Courses ON Enrollments.course_id = Courses.course_id \
            INNER JOIN Users ON Enrollments.user_id = Users.user_id \
            WHERE Enrollments.user_id = ? AND Enrollments.course_id = ?; \
        `;
            db.pool.query(get_update_enrollment_query, [user, course], (error, rows, fields) => {
                return res.json(rows);
            })
        }
    })
};

exports.delete_enrollment = (req, res, next) => {
    const enrollment_id = req.params.id;

    const delete_enrollment_query = ` \
        DELETE FROM Enrollments \
        WHERE enrollment_id = ?; \
    `;

    db.pool.query(delete_enrollment_query, [enrollment_id], (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
};
