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
