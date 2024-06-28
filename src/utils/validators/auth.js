const { body } = require("express-validator");
const prisma = require("../../../prisma/client/index");

const validateRegister = [
    body("fullName").notEmpty().withMessage("Name is required"),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

const validateLogin = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

const validatePPDB = [
    body("phoneNumber")
        .notEmpty()
        .withMessage("Phone Numper is required")
        .isMobilePhone("id-ID")
        .withMessage("Invalid Phone Number"),

    body("fullName").notEmpty().withMessage("Your Name is require"),
    body("placeOfBirth").notEmpty().withMessage("Place of birth is require"),
    body("dateOfBirth").notEmpty().withMessage("Date of birth is require"),
    body("schoolFrom").notEmpty().withMessage("School From is require"),
    body("address").notEmpty().withMessage("Address is require"),
];

module.exports = { validateRegister, validateLogin, validatePPDB };
