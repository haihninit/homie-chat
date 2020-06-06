const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/user');
/**
 * @swagger
 *
 * /users:
 *   get:
 *     tags:
 *      - Users
 *     security:
 *      - bearerAuth: []
 *     summary: Get user list
 *     description: Get user list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Data found
 *       404:
 *         description: Data not found
 *       401:
 *         description: Unauthorized
 */
router.get('/', UserController.getUserList);
router.get('/auth', UserController.authByToken);
router.delete('/', UserController.deleteUser);

module.exports = router
