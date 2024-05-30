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
