# stemleaf
stemleaf is an online course structured service.

## Overview
STEMLeaf is an online course structured service, offering 100 STEM related courses each with their own explorations and tests. STEMLeaf has 5,000 members, each requiring the use of one or more courses with their saved state. A database driven website will record the information regarding these courses, alongside the information of users partaking in these courses, and the staff teaching these courses. The overall purpose is to help users learn subjects they wish to learn and track their progress. 

## Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [Implementation](#implementation)
    - [Queries](#queries)
        - [DDL](#data-definition-queries)
        - [DML](#data-manipulation-queries)
    - [Frontend](#frontend)
        - [Adding](#adding)
        - [Updating](#updating)
        - [Deleting](#deleting)
    - [Backend](#backend)
        - [Routing](#routing)
        - [Controller](#controller)
- [References](#references)
    - [NodeJs Starter App](#nodejs-starter-app)
    - [Dynamic Navbar](#dynamic-navbar)
    - [Routing Reference](#routing-assistance)
    - [Styling Navbar](#navigation-bar-styling-guide)

## Implementation

### Queries

#### Data Definition Queries

Generated sample data using SQL by creating a table
``` sql
-- -----------------------------------------------------
-- Table Users
-- -----------------------------------------------------
CREATE OR REPLACE TABLE Users
(
    user_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    email VARCHAR(45) UNIQUE NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (email) REFERENCES Passwords(email) ON DELETE CASCADE
);
```
then inputting in sample data using an INSERT statement
``` sql
INSERT INTO Users (first_name, last_name, email)
VALUES
('Connor', 'Schutze', 'schutzec@osu.edu'),
('Tristan', 'Vosburg', 'vosburgt@osu.edu'),
('John', 'Doe', 'johndoe@osu.edu'),
('Doe', 'John', 'opposite@osu.edu'),
('Mark', 'Ham', 'hamm@osu.edu'),
('Alice', 'Johnson', 'alice.johnson@osu.edu'),
('Bob', 'Smith', 'bob.smith@osu.edu'),
('Charlie', 'Brown', 'charlie.brown@osu.edu'),
('David', 'Wilson', 'david.wilson@osu.edu'),
('Eva', 'Green', 'eva.green@osu.edu'),
('Frank', 'Miller', 'frank.miller@osu.edu'),
('Grace', 'Lee', 'grace.lee@osu.edu'),
('Hannah', 'White', 'hannah.white@osu.edu'),
('Ian', 'Taylor', 'ian.taylor@osu.edu'),
('Jack', 'Harris', 'jack.harris@osu.edu');
```

[DDL File](./database/queries/ddl.sql)

#### Data Manipulation Queries

Implemented CRUD for all entities by using various queries, (SELECT, INSERT, UPDATE, DELETE)
``` sql
-- -----------------------------------------------------
-- Users
-- -----------------------------------------------------
-- get data for all users
SELECT * FROM Users;

-- create a new user account
INSERT INTO Users (first_name, last_name, email)
VALUES (:first_name_input, :last_name_input, :email_input);

-- get data for a particular user
SELECT * FROM Users WHERE user_id = :user_id_key;

-- get all users names
SELECT CONCAT(Users.first_name, ' ', Users.last_name) AS first, last FROM Users;

-- update user information
UPDATE Users
SET first_name = :first_name_input, last_name = :last_name_input, email = :email_input
WHERE user_id = :user_id_key;

-- delete a user's account
DELETE FROM Users WHERE user_id = :user_id_key;
```

[DML File](./database/queries/dml.sql)

This is implemented in the controller files, see below
[Controller](#controller)

### Frontend

#### Adding

Implemented the frontend of adding an instructor by creating an
event listener for the adding form for each entity. Then saving that
information from the form on submission to create a request for the
backend to handle (update the database). Followed by calling a function 
to update the table on display.

Instructors implementation
``` js
// Get the objects we need to modify
let add_instructors_form = document.getElementById('add_instructors_form');

// Citation for the following code:
// Date: 05/24/2024
// Adapted from
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Description: Front end changes from database queries

// Modify the objects we need
add_instructors_form.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_staff_id = document.getElementById("input_instructors_staff_add");
    let input_course_id = document.getElementById("input_instructors_course_add");
    let input_staff_bio = document.getElementById("input_instructors_bio_add");

    // Get the values from the form fields
    let staff_id_value = input_staff_id.value;
    let course_id_value = input_course_id.value;
    let staff_bio_value = input_staff_bio.value;

    // Put our data we want to send in a javascript object
    let data = {
        staff_id: staff_id_value,
        course_id: course_id_value,
        staff_bio: staff_bio_value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/instructors/add/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let new_instructor = JSON.parse(xhttp.response)[0];
            // Add the new data to the table
            add_row_to_instructors(new_instructor);

            // Clear the input fields for another transaction
            input_staff_id.value = '';
            input_course_id.value = '';
            input_staff_bio.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})
```

The table is updating by creating elements for each attribute the
table requires. Then this is appended to a specific row in the table.
``` js
// Creates a single row from an Object representing a single record from 
// bsg_people
add_row_to_instructors = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let instructors_table = document.getElementById("instructors_table");

    // Create a row and 5 cells
    let row = document.createElement("TR");
    let id_cell = document.createElement("TD");
    let staff_cell = document.createElement("TD");
    let course_cell = document.createElement("TD");
    let bio_cell = document.createElement("TD");
    let delete_cell = document.createElement("TD");

    // Fill the cells with correct data
    id_cell.innerText = data.id;
    staff_cell.innerText = data.staff;
    course_cell.innerText = data.course;
    bio_cell.innerText = data.bio;

    let delete_button = document.createElement("button");
    delete_button.innerHTML = "Delete";
    delete_button.onclick = function(){
        delete_instructor_id(data.id);
    };
    delete_cell.appendChild(delete_button);

    // Add the cells to the row 
    row.appendChild(id_cell);
    row.appendChild(staff_cell);
    row.appendChild(course_cell);
    row.appendChild(bio_cell);
    row.appendChild(delete_cell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', data.id);
    
    // Add the row to the table
    instructors_table.appendChild(row);
}
```

[Add Instructor](./public/js/instructors/add_instructor.js)


#### Updating

Implemented the frontend of updating an instructor by creating an
event listener for the updating form for each entity. Then saving that
information from the form on submission to create a request for the
backend to handle (update the database). Followed by calling a function 
to update the table on display.

Instructors implementation
``` js
// Citation for the following code:
// Date: 05/24/2024
// Adapted from
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Description: Front end changes from database queries

// Get the objects we need to modify
let update_instructor_form = document.getElementById('update_instructor_form');

// Modify the objects we need
update_instructor_form.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_staff = document.getElementById("input_instructors_staff_update");
    let input_course = document.getElementById("input_instructors_course_update")
    let input_staff_bio = document.getElementById("input_instructors_bio_update");

    // Get the values from the form fields
    let staff_value = input_staff.value;
    let course_value = input_course.value;
    let staff_bio_value = input_staff_bio.value;

    // Put our data we want to send in a javascript object
    let data = {
        staff_id: staff_value,
        course_id: course_value,
        staff_bio: staff_bio_value,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `/instructors/update`, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            update_instructor_row(xhttp.response, staff_value, course_value);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})
```

The table is updating by parsing through the table and identifying 
which row has the changed data utilizing the id of the elements.
``` js
// update the row in the data table
function update_instructor_row(data, staff_id, course_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("instructors_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        let instructor_id_key = row.getAttribute("data-value");

        if (instructor_id_key == parsedData[0].id) {
            let td = row.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].bio;
            break;
        }
    }
}
```

[Add Instructor](./public/js/instructors/update_instructor.js)

#### Deleting

Implemented the frontend of deleting an instructor by creating an
event listener for the deleting button for each element for each entity. 
Then saving that information from the form on submission to create a 
request for the backend to handle (update the database). Followed by 
calling a function to update the table on display.

Instructors implementation
``` js
// Citation for the following code:
// Date: 05/24/2024
// Adapted from
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Description: Front end changes from database queries

function delete_instructor_id(id) {
    console.log("delete_instructor: start");
    // Put our data we want to send in a javascript object
    let data = {
        id: id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `/instructors/delete/${id}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            delete_instructor_row(id);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}
```

The table is deleting the specific row that contains the id that was deleted.
``` js
function delete_instructor_row(id){
    let table = document.getElementById("instructors_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == id) {
            table.deleteRow(i);
            break;
       }
    }
}
```

[Add Instructor](./public/js/instructors/delete_instructor.js)

### Backend

#### Routing

Utilized express to handle routing, each page has its own routing functions 
that are specified in the controller files. The routing is simplying using
these functions when certain requests are made.

``` js
// Citation for the following code:
// Date: 05/27/2024
// Based On
// Source URL: https://www.geeksforgeeks.org/express-js-express-router-function/
// Description: Used to Routes

const express = require('express');
const router = express.Router();
const {
    get_instructors,
    add_instructor,
    update_instructor,
    delete_instructor,
} = require('../controllers/instructors');

router.get('/', get_instructors);
router.post('/add', add_instructor);
router.put('/update', update_instructor);
router.delete('/delete/:id', delete_instructor);

module.exports = router;
```

#### Controller

The controller file simply uses the queries created in the 
data manipulation queries file in order to display, create, 
delete, and update all of the elements in each entity. Each part 
of CRUD has its own unique funciton with its specific query along 
with handling the data served from the frontend and responding 
with the required data.

``` js
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
```

[Instructors Controller](./controllers/instructors.js)

## References

### NodeJS Starter App

Utilized the provided starter app repository to formulate all of the
front end implementation for editing the database without refreshing the page
causing the website to be dynamic. Additionally, used for setting up 
express, handlebars, routing, and the server listener.

[Starter App Repo](https://github.com/osu-cs340-ecampus/nodejs-starter-app)

### Dynamic Navbar

Used a stack overflow to gain knowledge in middlewares used in web development
to make the navigation bar dynamic to the page. Each page's class is set to active
when that page is the currently opened page, allowing certain styles to be active.

[Stack Overflow Javascript](https://stackoverflow.com/questions/29235424/how-to-detect-if-page-is-current-in-each-pages)

### Routing Assistance

To better organize files and controll how the website was run. We implemented
routing based on the following resource so each request is met with the proper
responses.

[Routing Reference](https://www.geeksforgeeks.org/express-js-express-router-function/)

### Navigation Bar Styling Guide

Used the following resource to style the navigation bar.

[NavBar Styling](https://www.w3schools.com/css/css_navbar_horizontal.asp)
