const express = require('express');
const router = express.Router();
const {
    get_enrollments,
    add_enrollment,
} = require('../controllers/enrollments');

router.get('/', get_enrollments);
router.post('/add', add_enrollment);

module.exports = router;
