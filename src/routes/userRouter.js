const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const studentController = require("../controller/studentController");
const {
    validateRegister,
    validateLogin,
    validatePPDB,
} = require("../utils/validators/auth");
const { validateUpdateAdmin } = require("../utils/validators/admin");
const { verifyToken, verifyRoles } = require("../middleware/auth");
const upload = require("../middleware/multer");

//router student
router.post(
    "/studentRegis",
    verifyToken ,
    upload.single("image"),
    studentController.createStudent,
);
router.get("/students", studentController.getAllStudent);
router.get("/student/:userId", verifyToken, studentController.getStudent);
router.put(
    "/student/:userId/approved",
    verifyToken, verifyRoles,
    studentController.updateStudentApproved,
);
router.put(
    "/student/:userId/reject",
    verifyToken, verifyRoles,
    studentController.updateStudentReject,
);
router.delete("/student/:userId", verifyToken, verifyRoles, studentController.deleteStudent);

//router user
router.post("/register", validateRegister, userController.register);
router.post("/login", validateLogin, userController.login);
router.get(
    "/get-all-user",
    verifyToken,
    verifyRoles,
    userController.getAllUser,
);

router.get(
    "/users/:id",
    verifyToken,
    verifyRoles,
    userController.getUserById,
);

router.put(
    "/update-admin/:id",
    verifyToken,
    verifyRoles,
    userController.updateAdmin,
);
router.put("/logout", verifyToken, userController.logout);

router.delete("/users/:id", verifyToken, verifyRoles, userController.deleteUser )

module.exports = router;
