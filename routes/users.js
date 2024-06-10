const express = require('express');
const router = express.Router();
const {
    get_users,
    add_user,
    update_user,
    delete_user,
} = require('../controllers/users');

router.get('/', get_users);
router.post('/add', add_user);
router.put('/update', update_user);
router.delete('/delete/:id', delete_user);

module.exports = router;
