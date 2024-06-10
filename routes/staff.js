// Citation for the following code:
// Date: 05/27/2024
// Based On
// Source URL: instructors.js
// Description: Used to Routes

const express = require('express');
const router = express.Router();
const {
    get_staff,
    add_staff,
    update_staff,
    delete_staff
} = require('../controllers/staff');

router.get('/', get_staff);
router.post('/add', add_staff);
router.put('/update', update_staff);
router.delete('/delete/:id', delete_staff);

module.exports = router;
