const prisma = require("../../prisma/client");
const uploadImage = require("../services/uploadImage");
const cloudinary = require("cloudinary").v2;
// const { validationResult } = require("express-validator");

const createStudent = async (req, res, next) => {
    const {
        fullName,
        placeOfBirth,
        dateOfBirth,
        schoolFrom,
        address,
        phoneNumber,
        userId,
    } = req.body;

    const image = req.file;
    let imageUrl;
    let newStudentRegis;

    try {
        newStudentRegis = await prisma.studentRegis.create({
            data: {
                fullName,
                placeOfBirth,
                dateOfBirth,
                schoolFrom,
                address,
                phoneNumber,
                status: "pending",
                userId,
            },
        });

        if (image) {
            imageUrl = await uploadImage(image);
            const createdImage = await prisma.image.create({
                data: {
                    imageName: image.originalname,
                    imageUrl,
                    studentRegisId: newStudentRegis.id,
                },
            });
            res.status(201).json({
                success: true,
                message: "student created successfully",
                data: {
                    student: newStudentRegis,
                    imageUrl: createdImage.imageUrl,
                },
            });
        } else {
            res.status(201).json({
                success: true,
                message: "student created successfully without image",
                data: { student: newStudentRegis },
            });
        }
    } catch (error) {
        if (newStudentRegis) {
            await prisma.studentRegis.delete({
                where: {
                    id: newStudentRegis.id,
                },
            });
        }
        if (imageUrl) {
            const publicId = imageUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }
        res.status(400).json({
            error: "creation failed",
            details: error.message,
        });
        next(error);
    }
};

const getStudent = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const students = await prisma.studentRegis.findMany({
            where: {
                userId,
            },
            include: {
                images: true,
            },
        });

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            msg: "success",
            data: students.map((student) => ({
                ...student,
                images: student.images.map((image) => image.imageUrl),
            })),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve student",
            details: error.message,
        });
        next(error);
    }
};

const getAllStudent = async (req, res, next) => {
    const students = await prisma.studentRegis.findMany({
        include: {
            images: true,
        },
    });
    res.status(200).send({
        success: true,
        message: "success get all students",
        students,
    });
};

const updateStudentApproved = async (req, res, next) => {
    const { id } = req.params;
    try {
        const student = await prisma.studentRegis.findUnique({
            where: { id },
        });

        if (!student) {
            throw new NotFound("student not found");
        }

        const updateStudent = await prisma.studentRegis.update({
            where: { id },
            data: { status: "approved" },
        });
        res.json(updateStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateStudentReject = async (req, res, next) => {
    const { id } = req.params;
    try {
        const student = await prisma.studentRegis.findUnique({
            where: { id },
        });

        if (!student) {
            throw new NotFound("student not found");
        }

        const updateStudent = await prisma.studentRegis.update({
            where: { id },
            data: { status: "reject" },
        });
        res.json(updateStudent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteStudent = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Mencari student berdasarkan id
        const student = await prisma.studentRegis.findUnique({ where: { id } });

        // Jika student tidak ditemukan, kirimkan respon 404
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Menghapus student berdasarkan id
        await prisma.studentRegis.delete({ where: { id } });

        // Mengirimkan respon sukses
        res.status(200).json({
            success: true,
            message: "Student has been deleted",
        });
    } catch (error) {
        // Menangani kesalahan dan mengirimkan respon error
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = {
    createStudent,
    getStudent,
    getAllStudent,
    updateStudentApproved,
    updateStudentReject,
    deleteStudent,
};
