const express = require('express');
const router = express.Router();
const {
    get_enrollments,
    add_enrollment,
    update_enrollment,
    delete_enrollment,
} = require('../controllers/enrollments');

router.get('/', get_enrollments);
router.post('/add', add_enrollment);
router.put('/update', update_enrollment);
router.delete('/delete/:id', delete_enrollment);

module.exports = router;
