const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { Unauthorized } = require('http-errors');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').split(" ")[1];
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(403).send('Invalid token.');
    }
};

const verifyRoles = async (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (!token) {
            throw new Unauthorized("Access denied. No token provided.");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (user.role !== "Admin") {
            throw new Unauthorized("You are not authorized to access this endpoint");
        }
        req.user = user;
        next();
    } catch (ex) {
        next(ex);
    }
};


module.exports = { verifyToken, verifyRoles };

