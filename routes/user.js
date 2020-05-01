const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.get('/', UserController.getUserList);
router.delete('/', UserController.deleteUser);

module.exports = router;
