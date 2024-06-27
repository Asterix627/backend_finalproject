const { body } = require('express-validator');
const prisma = require('../../../prisma/client/index');

const validateUpdateAdmin = [
  body('role').notEmpty().withMessage('Role is required'),
  body('role').isIn(['admin', 'superadmin']).withMessage('Invalid role'),
];

module.exports = { validateUpdateAdmin };