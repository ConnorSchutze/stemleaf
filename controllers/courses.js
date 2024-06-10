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

exports.update_course = (req, res, next) => {
    const data = req.body;

    const id = data.id;
    const subject = data.subject;
    const description = data.description;

    const update_course_query = ` \
        UPDATE Courses \
        SET subject = ?, description = ? \
        WHERE course_id = ?; \
    `;

    const update_course_data = [subject, description, id];

    db.pool.query(update_course_query, update_course_data, (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            let get_update_course_query = ` \
            SELECT \
            course_id AS id, \
            name, \
            subject, \
            description \
            FROM Courses \
            WHERE course_id = ? \
        `;
            db.pool.query(get_update_course_query, [id], (error, rows, fields) => {
                return res.json(rows);
            })
        }
    })
};

exports.delete_course = (req, res, next) => {
    const course_id = req.params.id;

    const delete_course_query = ` \
        DELETE FROM Courses \
        WHERE course_id = ?; \
    `;

    db.pool.query(delete_course_query, [course_id], (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
};
