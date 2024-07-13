const express = require("express");
const router = express.Router();
const { verifyToken, verifyRoles } = require("../middleware/auth");
const upload = require("../middleware/multer");
const studentController = require("../controller/studentController");

router.post(
    "/studentRegis",
    verifyToken,
    upload.single("image"),
    studentController.createStudent,
);
router.get(
    "/students",
    verifyToken,
    verifyRoles,
    studentController.getAllStudent,
);

router.get("/student/:userId", verifyToken, studentController.getStudent);

router.put(
    "/student/:userId/approved",
    verifyToken,
    verifyRoles,
    studentController.updateStudentApproved,
);
router.put(
    "/student/:userId/reject",
    verifyToken,
    verifyRoles,
    studentController.updateStudentReject,
);
router.delete(
    "/student/:userId",
    verifyToken,
    verifyRoles,
    studentController.deleteStudent,
);

module.exports = router;
