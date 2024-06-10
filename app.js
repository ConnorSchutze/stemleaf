/*
    SETUP
*/

// Citation for the following code:
// Date: 05/24/2024
// Adapted from
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Description: Used to setup Express, Handlebars, Routes (Homepage), and Listener

// Express
var path = require('path');
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT = 10256;

// Handlebars
var { engine } = require('express-handlebars');
app.engine('.hbs', engine({
    extname: ".hbs",
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', '.hbs');

// Citation for the following code:
// Date: 05/30/2024
// Based on
// Source URL: https://stackoverflow.com/questions/29235424/how-to-detect-if-page-is-current-in-each-pages
// Description: Used to setup Middleware (Navbar UI (Active Page is Colored))
//              I spent hours figuring out how to incorporate an active class with javascript

// Register Handlebars helper function
const handlebars = require('handlebars');
handlebars.registerHelper('isActivePage', function(path, activePage) {
    return path === activePage;
});

// Middleware to set active page
app.use((req, res, next) => {
    res.locals.activePage = req.path;
    next();
});

const { out } = require('forever');

// Citation for the following code:
// Date: 05/27/2024
// Based On
// Source URL: https://www.geeksforgeeks.org/express-js-express-router-function/
// Description: Used to Routes

// Routes
const courses_routes = require('./routes/courses');
const enrollments_routes = require('./routes/enrollments');
const instructors_routes = require('./routes/instructors');
const staff_routes = require('./routes/staff');
const users_routes = require('./routes/users');

// Use the public folder for static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/courses', courses_routes);
app.use('/enrollments', enrollments_routes);
app.use('/instructors', instructors_routes);
app.use('/staff', staff_routes);
app.use('/users', users_routes);

/*
    ROUTES
*/
// Define the route for the homepage
app.get('/', (req, res) => {
    res.render('index');
});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});