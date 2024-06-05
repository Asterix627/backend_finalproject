const express = require('express');
const router = express.Router();
const registerController = require('../controller/userController');
const {validateRegister, validateLogin} = require('../utils/validators/auth');
const {validateUpdateAdmin} = require('../utils/validators/admin');
const {verifyToken, verifyRoles} = require('../middleware/auth');

router.post('/register', validateRegister, registerController.register);
router.post('/login', validateLogin, registerController.login);
router.get('/get-all-user', verifyToken, verifyRoles, registerController.getAllUser);
router.put('/update-admin/:id', verifyToken, verifyRoles, validateUpdateAdmin, registerController.updateAdmin);
router.put('/logout', verifyToken, registerController.logout);

module.exports = router;

