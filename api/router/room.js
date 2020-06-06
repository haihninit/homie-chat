const express = require('express');
const router = express.Router();
const RoomController = require('../../controllers/room');

router.get('/', RoomController.getListRoom);

module.exports = router
