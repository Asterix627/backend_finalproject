const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { createTeacher, getTeachers, getDetailsTeacher, deleteTeacher, updateTeacher } = require('../controller/teacherController');
const { verifyToken, verifyRoles } = require('../middleware/auth');


router.post('/teacher', upload.single('image'), verifyToken, verifyRoles, createTeacher);
router.get('/teachers', getTeachers);
router.get('/teacher/:id', getDetailsTeacher);
router.put('/teacher/:id', upload.single('image'), verifyToken, verifyRoles, updateTeacher);
router.delete('/teacher/:id', verifyToken, verifyRoles, deleteTeacher);

module.exports = router;
