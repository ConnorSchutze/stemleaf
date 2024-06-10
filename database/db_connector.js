// ./database/db-connector.js

// Citation for the following code:
// Date: 05/24/2024
// Adapted from
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Description: Database helper

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_schutzec',
    password        : '9707',
    database        : 'cs340_schutzec'
})

// Export it for use in our applicaiton
module.exports.pool = pool;