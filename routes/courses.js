const express = require('express');
const router = express.Router();
const {
    get_courses,
    add_course,
} = require('../controllers/courses');

router.get('/', get_courses);
router.post('/add', add_course);

module.exports = router;
