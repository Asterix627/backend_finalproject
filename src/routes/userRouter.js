const express = require("express");
const router = express.Router();
const registerController = require("../controller/userController");
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
    upload.single("image"),
    validatePPDB,
    studentController.createStudent,
);
router.get("/students", verifyToken, studentController.getAllStudent);
router.get("/student/:id", verifyToken, studentController.getStudent);
router.put(
    "/student/:id/approved",
    verifyToken,
    studentController.updateStudentApproved,
);
router.put(
    "/student/:id/reject",
    verifyToken,
    studentController.updateStudentReject,
);

//router user
router.post("/register", validateRegister, registerController.register);
router.post("/login", validateLogin, registerController.login);
router.get(
    "/get-all-user",
    verifyToken,
    verifyRoles,
    registerController.getAllUser,
);
router.put(
    "/update-admin/:id",
    verifyToken,
    verifyRoles,
    validateUpdateAdmin,
    registerController.updateAdmin,
);
router.put("/logout", verifyToken, registerController.logout);

module.exports = router;
