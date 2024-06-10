var db = require('../database/db_connector');

// Citation for the following code:
// Date: 05/27/2024
// Adapted from
// Source URL: instructors.js
// Description: Routes, Queries, CRUD

exports.get_users = (req, res, next) => {
    let users_query;

    if (!req.query.first_name || req.query.first_name === '') {
        users_query = ` \
            SELECT \
            Users.user_id AS  id, \
            Users.first_name AS first, \
            Users.last_name AS last, \
            Users.email\
            FROM Users \
            ORDER BY id; \
        `;
    } else {
        const first_name = req.query.first_name;
        users_query = ` \
            SELECT \
            Users.user_id AS  id, \
            Users.first_name AS first, \
            Users.last_name AS last, \
            Users.email\
            FROM Users \
            WHERE Users.first_name LIKE '${first_name}%' \
            ORDER BY id; \
        `;
    }

    db.pool.query(users_query, (error, rows, fields) => {
        let users = rows;
        return res.render('pages/users', {data: users});
    })
};

exports.add_user = (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;

    const add_passwords_query = ` \
        INSERT INTO Passwords (email, password_hash, password_update) \
        VALUES (?, ?, CURRENT_DATE); \
    `;

    const add_users_query = ` \
        INSERT INTO Users (first_name, last_name, email) \
        VALUES (?, ?, ?); \
    `;

    const new_password_data = [email, password];
    const new_user_data = [first_name, last_name, email];

    db.pool.query(add_passwords_query, new_password_data, (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            db.pool.query(add_users_query, new_user_data, (error, results) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(500);
                } else {
                    const new_user_id = results.insertId;
                    const add_user_query = ` \
                        SELECT \
                        Users.user_id AS id, \
                        Users.first_name AS first, \
                        Users.last_name AS last, \
                        Users.email\
                        FROM Users \
                        WHERE Users.user_id = ?; \
                    `;
        
                    db.pool.query(add_user_query, [new_user_id], (error, rows, fields) => {
                        return res.json(rows);
                    })
                }
            })
        }
    })
};

exports.update_user = (req, res, next) => {
    const data = req.body;

    const email = data.email;
    const first_name = data.first_name;
    const last_name = data.last_name;

    const update_user_query = ` \
        UPDATE Users \
        SET Users.first_name = ?, Users.last_name = ? \
        WHERE Users.email = ?; \
    `;

    const update_user_data = [first_name, last_name, email];

    db.pool.query(update_user_query, update_user_data, (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            let get_update_user_query = ` \
                SELECT \
                Users.user_id AS  id, \
                Users.first_name AS first, \
                Users.last_name AS last, \
                Users.email \
                FROM Users \
                WHERE Users.email = ? \
            `;
            db.pool.query(get_update_user_query, [email], (error, rows, fields) => {
                return res.json(rows);
            })
        }
    })
};

exports.delete_user = (req, res, next) => {
    const user_id = req.params.id;

    const delete_password_query = ` \
        DELETE FROM Passwords \
        WHERE email = (SELECT email FROM Users WHERE user_id = ?) \
    `;

    const delete_user_query = ` \
        DELETE FROM Users \
        WHERE user_id = ?; \
    `;

    db.pool.query(delete_password_query, [user_id], (error, results) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(delete_user_query, [user_id], (error, results) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
};
