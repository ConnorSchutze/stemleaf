var db = require('../database/db_connector');

// Citation for the following code:
// Date: 05/27/2024
// Adapted from
// Source URL: instructors.js
// Description: Routes, Queries, CRUD

exports.get_staff = (req, res, next) => {
    // Temporary function for getting courses
    // TODO: Implement the function to retrieve courses from the database
    let staff_query;


    if(!req.query.staff_name || req.query.staff_name === '') {
        staff_query = ` \
            SELECT \
            Staff.staff_id AS id,   \
            COALESCE(CONCAT(Users.first_name, ' ', Users.last_name), 'unavailable') AS staff_name, \
            Staff.start_date AS start_date, \
            Staff.chg_hour AS chg_hour \
            FROM Staff \
            LEFT JOIN Users ON Staff.user_id = Users.user_id \
            ORDER BY id; \
        `;
    } else {
        const staff_name = req.query.staff_name;
        staff_query = ` \
            SELECT \
            Staff.staff_id AS id,   \
            COALESCE(CONCAT(Users.first_name, ' ', Users.last_name), 'unavailable') AS staff_name, \
            Staff.start_date AS start_date, \
            Staff.chg_hour AS chg_hour \
            FROM Staff \
            LEFT JOIN Users ON Staff.user_id = Users.user_id \
            WHERE CONCAT(Users.first_name, ' ', Users.last_name) LIKE '${staff_name}%' \
            ORDER BY id; \
        `;
    }

    let users_query = ` \
        SELECT \
        Users.user_id AS id, \
        CONCAT(Users.first_name, ' ', Users.last_name) AS name \
        FROM Staff \
        RIGHT JOIN Users ON Staff.user_id = Users.user_id \
        WHERE Staff.user_id IS NULL \
        ORDER BY name; \
    `;

    let update_query = ` \
        SELECT \
        Staff.staff_id AS id,   \
        CONCAT(Users.first_name, ' ', Users.last_name) AS staff_name, \
        Staff.start_date AS start_date, \
        Staff.chg_hour AS chg_hour \
        FROM Staff \
        INNER JOIN Users ON Staff.user_id = Users.user_id \
        ORDER BY id; \
    `;


    db.pool.query(staff_query, (error, rows, fields) => {
        let staff = rows;
        db.pool.query(users_query, (error, rows, fields) => {
            let users = rows;
            db.pool.query(update_query, (error, rows, fields) => {
                let update = rows;
                return res.render('pages/staff', {data: staff, users: users, update: update});
            })
        })
    })
};

exports.add_staff = (req, res, next) => {
    const { user_id, start_date, chg_hour } = req.body;

    const add_staff_query = ` \
        INSERT INTO Staff (user_id, start_date, chg_hour) \
        VALUES (?, ?, ?); \
    `;

    db.pool.query(add_staff_query, [user_id, start_date, chg_hour], (error, results) => {
        const new_staff_id = results.insertId;
        let add_instructor_query = ` \
            SELECT \
            Staff.staff_id AS id,   \
            COALESCE(CONCAT(Users.first_name, ' ', Users.last_name), 'unavailable') AS staff_name, \
            Staff.start_date AS start_date, \
            Staff.chg_hour AS chg_hour \
            FROM Staff \
            LEFT JOIN Users ON Staff.user_id = Users.user_id \
            WHERE Staff.staff_id = ?; \
        `;

        db.pool.query(add_instructor_query, [new_staff_id], (error, rows, fields) => {
            return res.json(rows);
        })
    });
};

exports.update_staff = (req, res, next) => {
    const data = req.body;

    const staff_id = parseInt(data.staff_id);
    const staff_name = data.staff_name;
    const start_date = data.start_date;
    const chg_hour = parseInt(data.chg_hour);
    const null_opt = data.null_opt;

    let update_staff_query;
    if (null_opt) {
        update_staff_query = ` \
            UPDATE Staff \
            SET start_date = ?, chg_hour = ?, user_id = NULL \
            WHERE staff_id = ?; \
        `;
    } else {
        update_staff_query = ` \
            UPDATE Staff \
            SET start_date = ?, chg_hour = ? \
            WHERE staff_id = ?; \
        `;
    }

    const update_staff_data = [start_date, chg_hour, staff_id];

    db.pool.query(update_staff_query, update_staff_data, (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            let get_update_instructor_query = ` \
            SELECT \
            Staff.staff_id AS id,   \
            COALESCE(CONCAT(Users.first_name, ' ', Users.last_name), 'unavailable') AS staff_name, \
            Staff.start_date AS start_date, \
            Staff.chg_hour AS chg_hour \
            FROM Staff \
            LEFT JOIN Users ON Staff.user_id = Users.user_id \
            WHERE Staff.staff_id = ?; \
            `;
            db.pool.query(get_update_instructor_query, [staff_id], (error, rows, fields) => {
                return res.json(rows);
            })
        }
    });
}



exports.delete_staff = (req, res, next) => {
    const staff_id = req.params.id;

    const delete_staff_query = ` \
        DELETE FROM Staff \
        WHERE staff_id = ?; \
    `;

    db.pool.query(delete_staff_query, [staff_id], (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    });
}

