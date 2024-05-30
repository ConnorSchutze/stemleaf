const express = require('express');
const router = express.Router();
const {
    get_users,
    add_user,
} = require('../controllers/users');

router.get('/', get_users);
router.post('/add', add_user);

module.exports = router;
