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

// Handlebars
var { engine } = require('express-handlebars');
app.engine('.hbs', engine({
    extname: ".hbs",
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', '.hbs');

const { out } = require('forever');

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