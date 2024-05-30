var db = require('../database/db_connector');

exports.get_courses = (req, res, next) => {
    let courses_query;

    if (!req.query.subject || req.query.subject === '') {
        courses_query = ` \
            SELECT \
            course_id AS id, \
            name, \
            subject, \
            description \
            FROM Courses \
            ORDER BY id; \
        `;
    } else {
        const subject = req.query.subject;
        courses_query = ` \
            SELECT \
            course_id AS id, \
            name, \
            subject, \
            description \
            FROM Courses \
            WHERE subject LIKE '${subject}%' \
            ORDER BY id; \
        `;
    }

    db.pool.query(courses_query, (error, rows, fields) => {
        let courses = rows;
        return res.render('pages/courses', {data: courses});
    })
};

exports.add_course = (req, res, next) => {
    const { name, subject, description } = req.body;

    const add_courses_query = ` \
        INSERT INTO Courses (name, subject, description) \
        VALUES (?, ?, ?); \
    `;

    const new_course_data = [name, subject, description];

    db.pool.query(add_courses_query, new_course_data, (error, results) => {
        const new_course_id = results.insertId;
        let add_course_query = ` \
            SELECT \
            course_id AS id, \
            name, \
            subject, \
            description \
            FROM Courses \
            WHERE course_id = ?; \
        `;

        db.pool.query(add_course_query, [new_course_id], (error, rows, fields) => {
            return res.json(rows);
        })
    })
};
