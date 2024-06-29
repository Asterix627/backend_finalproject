const express = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const prisma = require("../../prisma/client/index");
const { Conflict, Unauthorized, NotFound } = require("http-errors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const idGenerator = require("../utils/idGenerator");

const register = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                msg: "Validation error",
                success: false,
                errors: errors.array(),
            });
        }

        const { fullName, email, password } = req.body;
        const userEmail = await prisma.user.findUnique({ where: { email } });

        if (userEmail) {
            throw new Conflict("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const idUser = idGenerator("USR");

        const user = await prisma.user.create({
            data: {
                id: idUser,
                fullName: fullName,
                email: email,
                password: hashedPassword,
            },
        });

        res.status(201).send({
            success: true,
            message: "User created successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
            include: { studentRegis: true },
        });

        if (!user) {
            throw new Unauthorized("Email not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Unauthorized("Invalid password");
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "365d",
        });

        await prisma.user.update({
            where: { id: user.id },
            data: { token: token },
        });

        const hasStudentRegis = user.studentRegis.length > 0;
        const studentRegisId = hasStudentRegis ? user.studentRegis[0].id : null;

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
        next(error);
    }
};

const getAllUser = async (req, res, next) => {
    const users = await prisma.user.findMany();
    res.send({
        success: true,
        message: "All Users",
        data: users,
    });
};

const getUserById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) {
            throw new NotFound("User not found");
        }

        res.send({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

const updateAdmin = async (req, res, next) => {
    const { id } = req.params;

    try {
        const getUser = await prisma.user.findUnique({
            where: { id: id },
        });

        if (!getUser) {
            throw new NotFound("User not found");
        }

        if (getUser.role === "Admin") {
            throw new Conflict("User is already admin");
        }

        const updateAdmin = await prisma.user.update({
            where: { id: id },
            data: { role: "Admin" },
        });

        if (!updateAdmin) {
            throw new NotFound("User not found");
        }

        res.status(200).send({
            success: true,
            message: "Admin role updated successfully",
            data: updateAdmin,
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    const { id } = req.user;

    const getUser = await prisma.user.findUnique({
        where: { id: id },
    });

    if (!getUser) {
        throw new NotFound("User not found");
    }

    const user = await prisma.user.update({
        where: { id: id },
        data: { token: null },
    });

    if (!user) {
        throw new NotFound("User not found");
    }

    res.send({
        success: true,
        message: "Logout successful",
        user,
    });
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) {
            throw new NotFound("User not found");
        }

        await prisma.user.delete({
            where: { 
                id: id 
            },
        });

        res.send({
            success: true,
            message: "User deleted successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getAllUser,
    getUserById,
    updateAdmin,
    logout,
    deleteUser,
};
