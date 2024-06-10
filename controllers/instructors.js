var db = require('../database/db_connector');

// Citation for the following code:
// Date: 05/24/2024
// Adapted from
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Description: Routes, Queries, CRUD

exports.get_instructors = (req, res, next) => {
    let instructors_query;

    if (!req.query.course_name || req.query.course_name === '') {
        // query displaying ids as string values by joining other entities
        instructors_query = ` \
            SELECT \
            Instructors.instructor_id AS  id, \
            COALESCE(CONCAT(Users.first_name, ' ', Users.last_name), 'unavailable') AS staff, \
            Courses.name AS course, \
            Instructors.staff_bio AS bio \
            FROM Instructors \
            INNER JOIN Courses ON Instructors.course_id = Courses.course_id \
            INNER JOIN Staff ON Instructors.staff_id = Staff.staff_id \
            LEFT JOIN Users ON Staff.user_id = Users.user_id \
            ORDER BY id; \
        `;
    } else {
        // search query
        const course_name = req.query.course_name;
        instructors_query = ` \
            SELECT \
            Instructors.instructor_id AS  id, \
            COALESCE(CONCAT(Users.first_name, ' ', Users.last_name), 'unavailable') AS staff, \
            Courses.name AS course, \
            Instructors.staff_bio AS bio \
            FROM Instructors \
            INNER JOIN Courses ON Instructors.course_id = Courses.course_id \
            INNER JOIN Staff ON Instructors.staff_id = Staff.staff_id \
            LEFT JOIN Users ON Staff.user_id = Users.user_id \
            WHERE Courses.name LIKE '${course_name}%' \
            ORDER BY id; \
        `;
    }

    // staff query for staff data in hbs
    let staff_query = ' \
        SELECT Staff.staff_id, Users.first_name, Users.last_name \
        FROM Staff \
        INNER JOIN Users ON Staff.user_id = Users.user_id; \
    ';

    // courses query for course data in hbs
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
    // constant data from request
    const { staff_id, course_id, staff_bio } = req.body;

    // insert query with input operators
    const add_instructors_query = ` \
        INSERT INTO Instructors (staff_id, course_id, staff_bio) \
        VALUES (?, ?, ?); \
    `;

    const new_instructor_data = [staff_id, course_id, staff_bio];

    db.pool.query(add_instructors_query, new_instructor_data, (error, results) => {
        const new_instructor_id = results.insertId;
        // updated instructory query for table
        let add_instructor_query = ` \
            SELECT \
            Instructors.instructor_id AS id, \
            COALESCE(CONCAT(Users.first_name, ' ', Users.last_name), 'unavailable') AS staff, \
            Courses.name AS course, \
            Instructors.staff_bio AS bio \
            FROM Instructors \
            INNER JOIN Courses ON Instructors.course_id = Courses.course_id \
            INNER JOIN Staff ON Instructors.staff_id = Staff.staff_id \
            LEFT JOIN Users ON Staff.user_id = Users.user_id \
            WHERE Instructors.instructor_id = ?; \
        `;
        
        db.pool.query(add_instructor_query, [new_instructor_id], (error, rows, fields) => {
            // just send the new row not everything
            return res.json(rows);
        })
    })
};

exports.update_instructor = (req, res, next) => {
    const data = req.body;

    // updated data
    const staff_id = parseInt(data.staff_id);
    const course_id = parseInt(data.course_id);
    const staff_bio = data.staff_bio;

    // update query based on two foreign keys
    const update_instructor_query = ` \
        UPDATE Instructors \
        SET staff_bio = ? \
        WHERE staff_id = ? AND course_id = ?; \
    `;

    const update_instructor_data = [staff_bio, staff_id, course_id];

    db.pool.query(update_instructor_query, update_instructor_data, (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            // get updated row
            let get_update_instructor_query = ` \
                SELECT \
                Instructors.instructor_id AS id, \
                COALESCE(CONCAT(Users.first_name, ' ', Users.last_name), 'unavailable') AS staff, \
                Courses.name AS course, \
                Instructors.staff_bio AS bio \
                FROM Instructors \
                INNER JOIN Courses ON Instructors.course_id = Courses.course_id \
                INNER JOIN Staff ON Instructors.staff_id = Staff.staff_id \
                LEFT JOIN Users ON Staff.user_id = Users.user_id \
                WHERE Instructors.staff_id = ? AND Instructors.course_id = ?; \
            `;
            db.pool.query(get_update_instructor_query, [staff_id, course_id], (error, rows, fields) => {
                return res.json(rows);
            })
        }
    })
};

exports.delete_instructor = (req, res, next) => {
    const instructor_id = req.params.id;

    // delete based on id
    const delete_instructor_query = ` \
        DELETE FROM Instructors \
        WHERE instructor_id = ?; \
    `;

    db.pool.query(delete_instructor_query, [instructor_id], (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
};
