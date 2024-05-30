const express = require('express');
const router = express.Router();
const {
    get_staff,
    add_staff,
} = require('../controllers/staff');

router.get('/', get_staff);
router.post('/add', add_staff);

module.exports = router;
