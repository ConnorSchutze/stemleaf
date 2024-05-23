/*
    SETUP
*/

// Express
var path = require('path');
var express = require('express');
var app = express();
PORT = 10256;

// Database
var db = require('./database/db-connector');

// Handlebars
//var exphbs = require('express-handlebars');
//const { query } = require('express');
//app.engine('.hbs', exphbs({
//    extname: ".hbs"
//}));
//app.set('view engine', '.hbs');
// IDK why this doesn't work

// Handlebars
var { engine } = require('express-handlebars');
const { out } = require('forever');
app.engine('.hbs', engine({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');

//Use the public folder for static files
app.use(express.static(path.join(__dirname, 'public')));



/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        //does this need to reference the .sql files in the future?
        let query1 = "SELECT staff_id AS StaffID, course_id AS CourseID, staff_bio AS StaffBio FROM Instructors;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('index', {data: rows});
        })
    });

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
