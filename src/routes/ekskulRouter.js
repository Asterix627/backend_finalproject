const express = require("express")
const router = express.Router()
const upload = require("../middleware/multer")
const {verifyToken, verifyRoles} = require("../middleware/auth")
const {addEkskul, getAllEkskul, getEkskulById, updateEkskul, deleteEkskul} = require("../controller/ekskulController")

router.post("/ekskul", upload.array('images'), verifyToken, verifyRoles, addEkskul)
router.get("/ekskuls", getAllEkskul)
router.get("/ekskul/:id", getEkskulById)
router.put("/ekskul/:id", upload.array('images'), verifyToken, verifyRoles, updateEkskul)
router.delete("/ekskul/:id", verifyToken, verifyRoles, deleteEkskul)

module.exports = router;