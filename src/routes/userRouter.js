const express = require('express');
const router = express.Router();
const registerController = require('../controller/userController');
const {validateRegister, validateLogin} = require('../utils/validators/auth');
const {verifyToken, verifyRoles} = require('../middleware/auth');

router.post('/register', validateRegister, registerController.register);
router.post('/login', validateLogin, registerController.login);
router.get('/get-all-user', verifyToken, verifyRoles, registerController.getAllUser);

module.exports = router;

