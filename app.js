/*
    SETUP
*/

// Express
var path = require('path');
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT = 10256;

// Database
var db = require('./database/db-connector');

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
    // does this need to reference the .sql files in the future?
    // this is better than getting 1-few lines from an sql file, more efficient, less dynamic

    let query1;

    if (req.query.course_name === undefined || req.query.course_name === "")
    {
        query1 = ' \
            SELECT Instructors.instructor_id, Instructors.staff_id, Instructors.course_id, Instructors.staff_bio \
            FROM Instructors \
            INNER JOIN Courses ON Instructors.course_id = Courses.course_id \
        ';

    }

    else
    {
        console.log(req.query);
        query1 = ` \
            SELECT Instructors.instructor_id, Instructors.staff_id, Instructors.course_id, Instructors.staff_bio \
            FROM Instructors \
            INNER JOIN Courses ON Instructors.course_id = Courses.course_id \
            WHERE Courses.name LIKE "${req.query.course_name}%"; \
        `;
    }

    let query2 = " \
        SELECT Staff.staff_id, Users.first_name, Users.last_name, Staff.start_date \
        FROM Staff \
        INNER JOIN Users ON Staff.user_id = Users.user_id; \
    ";

    let query3 = "SELECT * FROM Courses;";

    db.pool.query(query1, function(error, rows, fields){

        let instructors = rows;

        db.pool.query(query2, (error, rows, field) => {

            let staff = rows;

            // Construct an object for reference in the table
            // Array.map is awesome for doing something with each
            // element of an array.
            let staff_map = {};
            staff.map(s => {
                let id = parseInt(s.staff_id, 10);
                staff_map[id] = s.last_name;
            });

            // Overwrite the staff_id with the last name of the staff member in the instructors object
            instructors = instructors.map(instructor => {
                return Object.assign(instructor, { staff_id: staff_map[instructor.staff_id] });
            });

            db.pool.query(query3, (error, rows, field) => {

                let courses = rows

                // Construct an object for reference in the table
                // Array.map is awesome for doing something with each
                // element of an array.
                let course_map = {};
                courses.map(c => {
                    let id = parseInt(c.course_id, 10);
                    course_map[id] = c.name;
                });

                // Overwrite the staff_id with the last name of the staff member in the instructors object
                instructors = instructors.map(instructor => {
                    return Object.assign(instructor, { course_id: course_map[instructor.course_id] });
                });

                return res.render('index', {data: instructors, staff: staff, courses: courses});
            })
        })
    })
});

// POST ROUTES
app.post('/add-instructor-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values

    // Create the query and run it on the database
    query1 = `INSERT INTO Instructors (staff_id, course_id, staff_bio) VALUES (${data.staff_id}, ${data.course_id}, '${data.staff_bio}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Instructors;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-instructor-ajax/', function(req,res,next){
    let data = req.body;
    let instructor_id = parseInt(data.instructor_id);
    let delete_instructor = `DELETE FROM Instructors WHERE instructor_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(delete_instructor, [instructor_id], function(error, rows, fields){
              if (error) {
  
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
})});

app.put('/put-instructor-ajax', function(req,res,next){
    let data = req.body;
  
    let staff_id = parseInt(data.staff_id);
    let course_id = parseInt(data.course_id);
    let staff_bio = data.staff_bio;
  
    let query_update_instructor = 'UPDATE Instructors SET staff_bio = ? WHERE staff_id = ? AND course_id = ?';
    let select_instructor = `SELECT * FROM Instructors WHERE staff_id = ? AND course_id = ?`;
  
        // Run the 1st query
        db.pool.query(query_update_instructor, [staff_bio, staff_id, course_id], function(error, rows, fields){
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(select_instructor, [staff_id, course_id], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
  })});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});