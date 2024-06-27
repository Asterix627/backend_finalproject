const { body } = require('express-validator');
const prisma = require('../../prisma/client');

const validateCreateUser = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email')
    .custom(async (value) => {
        if (!value) {
            throw new Error('Email is required');
        }
        const user = await prisma.user.findUnique({ where: { email: value } });
        if (user) {
            throw new Error('Email already exists');
        }
        return true;
    }),
    
    body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

module.exports = { validateCreateUser };