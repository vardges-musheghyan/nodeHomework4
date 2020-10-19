const express = require('express');

const router = express.Router();

const {
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/users');

// Routes with ( /api/users/:username );

router.route('/:username')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
