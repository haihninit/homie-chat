'use strict';
const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/user');
/**
 * @swagger
 *
 * /auth/signup:
 *   post:
 *     tags:
 *      - Auth
 *     summary: Create a new user
 *     requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                  - username
 *                  - password
 *                  - confirmPassword
 *                  - fullName
 *                  properties:
 *                      username:
 *                          type: string
 *                      password:
 *                          type: string
 *                      confirmPassword:
 *                          type: string
 *                      fullName:
 *                          type: string
 *                  example:
 *                      username: username123
 *                      fullName: Huynh Ngoc Hai
 *                      password: abc123
 *                      confirmPassword: abc123
 *     description: Create a new user
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Created successful
 *       400:
 *         description: Bad request
 */
router.post('/signup', UserController.createUser);

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     tags:
 *      - Auth
 *     summary: Login
 *     requestBody:
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                  - username
 *                  - password
 *                  properties:
 *                      username:
 *                          type: string
 *                      password:
 *                          type: string
 *                  example:
 *                      username: username123
 *                      password: "123456"
 *     description: Login
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Logged in successful
 *       400:
 *         description: Bad request
 */
router.post('/login', UserController.authenticate);

router.post('/logout', UserController.logout);

module.exports = router;
