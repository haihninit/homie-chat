const express = require('express');
const router = express.Router();
const MessageController = require('../../controllers/message');

router.get('/', MessageController.getListMessageByRoom);

module.exports = router
