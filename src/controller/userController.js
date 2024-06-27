// Mengimpor modul-modul yang diperlukan
const express = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const prisma = require("../../prisma/client/index");
const { Conflict, Unauthorized, NotFound } = require("http-errors");
const jwt = require("jsonwebtoken");

// Fungsi untuk registrasi pengguna baru
const register = async (req, res, next) => {
    try {
        // Validasi input
        const errors = validationResult(req);

        // Jika ada error validasi, kirimkan respon dengan status 422 dan daftar error
        if (!errors.isEmpty()) {
            return res.status(422).json({
                msg: "Validation error",
                success: false,
                errors: errors.array(),
            });
        }

        // Ambil data dari body request
        const { firstName, lastName, email, password } = req.body;
        // Periksa apakah email sudah terdaftar
        const userEmail = await prisma.user.findUnique({ where: { email } });

        // Jika email sudah terdaftar, lempar error Conflict
        if (userEmail) {
            throw new Conflict("Email already registered");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat pengguna baru di database
        const user = await prisma.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
            },
        });

        // Kirim respon sukses dengan status 201
        res.status(201).send({
            success: true,
            message: "User created successfully",
            user,
        });
    } catch (error) {
        // Tangani error
        next(error);
    }
};

// Fungsi untuk login pengguna
const login = async (req, res, next) => {
    try {
        // Ambil email dan password dari body request
        const { email, password } = req.body;
        // Cari pengguna berdasarkan email
        const user = await prisma.user.findUnique({
            where: { email },
            include: { studentRegis: true }, // Sertakan studentRegis untuk diperiksa
        });

        // Jika pengguna tidak ditemukan, lempar error Unauthorized
        if (!user) {
            throw new Unauthorized("Email not found");
        }

        // Periksa apakah password cocok
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Unauthorized("Invalid password");
        }

        // Buat token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Perbarui pengguna dengan token baru
        await prisma.user.update({
            where: { id: user.id },
            data: { token: token },
        });

        // Periksa apakah pengguna memiliki studentRegis
        const hasStudentRegis = user.studentRegis.length > 0;
        const studentRegisId = hasStudentRegis ? user.studentRegis[0].id : null;

        // Kirim respon sukses
        res.send({
            success: true,
            message: "Login successful",
            token,
            userId: user.id,
            role: user.role,
            hasStudentRegis,
            studentRegisId,
        });
    } catch (error) {
        // Tangani error
        next(error);
    }
};

// Fungsi untuk mendapatkan semua pengguna
const getAllUser = async (req, res, next) => {
    // Dapatkan semua pengguna dari database
    const users = await prisma.user.findMany();
    // Kirim respon sukses
    res.send({
        success: true,
        message: "All Users",
        data: users,
    });
};

// Fungsi untuk memperbarui pengguna menjadi admin
const updateAdmin = async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const user = req.user;
    try {
        // Periksa apakah pengguna memiliki peran admin
        if (user.role !== "admin") {
            throw new Unauthorized(
                "Unauthorized: Only admin can update admin roles",
            );
        }

        // Cari pengguna berdasarkan ID
        const getUser = await prisma.user.findUnique({
            where: { id: id },
        });

        // Jika pengguna tidak ditemukan, lempar error NotFound
        if (!getUser) {
            throw new NotFound("User not found");
        }

        // Jika pengguna sudah menjadi admin, lempar error Conflict
        if (getUser.role === "admin") {
            throw new Conflict("User is already admin");
        }

        // Perbarui peran pengguna menjadi admin
        const updateAdmin = await prisma.user.update({
            where: { id: id },
            data: { role: "admin" },
        });

        // Jika pembaruan gagal, lempar error NotFound
        if (!updateAdmin) {
            throw new NotFound("User not found");
        }

        // Kirim respon sukses
        res.status(200).send({
            success: true,
            message: "Admin role updated successfully",
            data: updateAdmin,
        });
    } catch (error) {
        // Tangani error
        next(error);
    }
};

// Fungsi untuk logout pengguna
const logout = async (req, res, next) => {
    const { id } = req.user;
    // Cari pengguna berdasarkan ID
    const getUser = await prisma.user.findUnique({
        where: { id: id },
    });
    // Jika pengguna tidak ditemukan, lempar error NotFound
    if (!getUser) {
        throw new NotFound("User not found");
    }
    // Perbarui token pengguna menjadi null
    const user = await prisma.user.update({
        where: { id: id },
        data: { token: null },
    });
    // Jika pembaruan gagal, lempar error NotFound
    if (!user) {
        throw new NotFound("User not found");
    }
    // Kirim respon sukses
    res.send({
        success: true,
        message: "Logout successful",
        user,
    });
};

// Ekspor semua fungsi
module.exports = {
    register,
    login,
    getAllUser,
    updateAdmin,
    logout,
};
