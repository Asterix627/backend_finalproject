const { body } = require('express-validator');
const prisma = require('../../prisma/client');

const validateCreateTeacher = [
  body('fullName')
    .notEmpty()
    .withMessage('Full Name is required')
    .isString()
    .withMessage('Full Name must be a string')
    .isLength({ max: 255 })
    .withMessage('Full Name cannot be longer than 255 characters'),

  body('NIP')
    .notEmpty()
    .withMessage('NIP is required')
    .isString()
    .withMessage('NIP must be a string')
    .isLength({ max: 255 })
    .withMessage('NIP cannot be longer than 255 characters'),

  body('position')
    .notEmpty()
    .withMessage('Position is required')
    .isString()
    .withMessage('Position must be a string')
    .isLength({ max: 255 })
    .withMessage('Position cannot be longer than 255 characters'),

  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .isString()
    .withMessage('Address must be a string')
    .isLength({ max: 255 })
    .withMessage('Address cannot be longer than 255 characters'),

  body('subjects')
    .notEmpty()
    .withMessage('Subjects are required')
    .isString()
    .withMessage('Subjects must be a string')
    .isLength({ max: 255 })
    .withMessage('Subjects cannot be longer than 255 characters'),
];

module.exports = validateCreateTeacher;
