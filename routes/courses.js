// Citation for the following code:
// Date: 05/27/2024
// Based On
// Source URL: instructors.js
// Description: Used to Routes

const express = require('express');
const router = express.Router();
const {
    get_courses,
    add_course,
    update_course,
    delete_course,
} = require('../controllers/courses');

router.get('/', get_courses);
router.post('/add', add_course);
router.put('/update', update_course);
router.delete('/delete/:id', delete_course);

module.exports = router;
