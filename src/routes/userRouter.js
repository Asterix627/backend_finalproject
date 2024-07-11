const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { validateRegister, validateLogin } = require("../utils/validators/auth");
const { validateUpdateAdmin } = require("../utils/validators/admin");
const { verifyToken, verifyRoles } = require("../middleware/auth");

router.post("/register", validateRegister, userController.register);
router.post("/login", validateLogin, userController.login);
router.get(
    "/get-all-user",
    verifyToken,
    verifyRoles,
    userController.getAllUser,
);
router.get("/users/:id", verifyToken, verifyRoles, userController.getUserById);
router.put(
    "/update-admin/:id",
    verifyToken,
    verifyRoles,
    userController.updateAdmin,
);
router.put("/logout", verifyToken, userController.logout);

router.delete(
    "/users/:id",
    verifyToken,
    verifyRoles,
    userController.deleteUser,
);

module.exports = router;
